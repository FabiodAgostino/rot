import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from 'src/app/models/Tickets';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TicketsComponent implements OnInit {

  constructor(private userService: UserService)
  {

  }
  filterOptions = ['Correzione dati tool', 'Malfunzionamento', 'Consigli','Tutto'];
  filterControl = new FormControl('');
  dataSource= new MatTableDataSource<Ticket>();
  displayedColumns: string[] = ['tipologia', 'tool', 'user', 'data','corretto'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  isExpanded=false;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  expandedElement?: Ticket;

  ngOnInit() {
    this.getTickets();
  }

  getTickets()
  {
    this.userService.getTickets().subscribe(tickets=>{
      this.dataSource.data=tickets
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: any=null, filterKey: string='') {
    var filterText = event?.value.trim().toLowerCase() || this.filterControl?.value!.trim().toLowerCase();
    if (filterKey === 'username') {
      this.dataSource.filterPredicate = (data: Ticket, filter: string) =>
        data.user!.toLowerCase().includes(filter);
    }else
    {
      if(filterText)
      {
        filterText = filterText=='tutto' ? '' : filterText;
        this.dataSource.filterPredicate = (data: Ticket, filter: string) =>
        data.tipologia!.toLowerCase().includes(filterText);
      }
    }

    this.dataSource.filter = filterText;
  }


  getDisplayedColumns()
  {
    return this.displayedColumns;
  }

  setTicketStatus(ticket:Ticket, corretto:boolean)
  {
    ticket.corretto=corretto;
    this.userService.updateTickets(ticket).subscribe(x=>{
      this.getTickets();
    })
  }

}
