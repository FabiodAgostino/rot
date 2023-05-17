import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FullUserDiscord, TokenDiscord } from 'src/app/models/discord';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.css']
})
export class UtentiComponent {

  userForm: FormGroup;
  dataSource: MatTableDataSource<FullUserDiscord>;
  displayedColumns: string[] = ['id', 'username', 'lastExpiresToken', 'serverAutenticazione', 'ruoli', 'actions', 'status'];
  isSmartphone: boolean=false;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private userService: UserService, private utils:Utils) {
    this.userForm = new FormGroup({
      id: new FormControl(),
      username: new FormControl(),
      lastLogin: new FormControl()
    });

    this.dataSource = new MatTableDataSource<FullUserDiscord>();
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(x => {
      this.dataSource.data = x;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.isSmartphone=this.utils.isSmartphone();
  }

  applyFilter(filterValue: any, key: string): void {
    const filterText = filterValue.value.trim().toLowerCase();
    if (key === 'username') {
      this.dataSource.filterPredicate = (data: FullUserDiscord, filter: string) =>
        data.username!.toLowerCase().includes(filter);
    } else if (key === 'lastLogin') {
      this.dataSource.filterPredicate = (data: FullUserDiscord, filter: string) =>
        new Date(data.lastExpiresToken.seconds * 1000 + Math.floor(data.lastExpiresToken.nanoseconds / 1000000)).toLocaleString().includes(filter);
    }

    this.dataSource.filter = filterText;
  }


  editUser(id: number): void {
    alert("Non ancora implementato");
  }

  deleteUser(user: FullUserDiscord): void {
    const c=confirm("Con questa funzionalità si revocherà permanentemente il token d'accesso all'utente e non potrà più accedere tramite il suo account discord, sei sicuro di voler continuare?");
    if(c)
      this.userService.updateUser(user);
  }

  sortData(event: any): void {
    const sortColumn = event.active;
    const sortDirection = event.direction;
    this.dataSource.sortingDataAccessor = (item: FullUserDiscord, property: string) => {
      switch (property) {
        case 'id':
          return item.id;
        case 'username':
          return item.username;
        case 'lastExpiresToken':
          return item.lastExpiresToken;
        case 'serverAutenticazione':
          return item.serverAutenticazione;
        case 'ruoli':
          return item.ruoli?.join(', ');
        default:
          return '';
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.sort.sort({ id: sortColumn, start: sortDirection, disableClear: false });
  }

  isUserActive(lastExpiresToken: { seconds: number, nanoseconds: number }): boolean {
    const tokenExpirationDate = new Date(lastExpiresToken.seconds * 1000);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - tokenExpirationDate.getTime();
    const minutesDifference = Math.floor(timeDifference / 1000 / 60);
    return minutesDifference <= 10;
  }

  getDisplayedColumns()
  {
    if(this.isSmartphone)
      return ['username', 'lastExpiresToken', 'ruoli', 'actions', 'status'];
    else
      return ['id', 'username', 'lastExpiresToken', 'serverAutenticazione', 'ruoli', 'actions', 'status'];
  }

}
