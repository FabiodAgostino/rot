import {FlatTreeControl, NestedTreeControl, TreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { FlatNode, Monster, MonsterNode } from 'src/app/models/Monster';
import { MonsterDexService } from 'src/app/service/monster-dex.service';




@Component({
  selector: 'app-monster-dex-tree',
  templateUrl: './monster-dex-tree.component.html',
  styleUrls: ['./monster-dex-tree.component.css'],
})
export class MonsterDexTreeComponent implements OnInit {

  @Output() renderImmagine = new EventEmitter<FlatNode>();
  filterText: string="";

  isFirstLoad = false;
  private transformer = (node: MonsterNode, level: number) => {
    return {
      expandable: !!node.folders && node.folders.length > 0,
      name: node.name,
      level: level,
      url: node!=null ? node.url : null,
      id: node!=null ? node.id : null
    };
  }
  
  
  treeControl = new FlatTreeControl<{ expandable: boolean; name: string; level: number; url: string | null; id: string | null}>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.folders);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  allData = new Array<MonsterNode>();
  constructor(private driveService: MonsterDexService) {}

  ngOnInit(): void {
    this.isFirstLoad=false;
    this.driveService.getFolderContent('1vBUdAhShyVQ-95eRsStkCl15UfBes6rC').subscribe(tree => {
      this.dataSource.data=tree;
      this.allData=tree;
      this.isFirstLoad=true;
    });
  }
  hasChild = (_: number, node: FlatNode) => { return node.expandable};

  renderImage(node: FlatNode)
  {
    this.renderImmagine.emit(node);
  }

  upload(node:FlatNode)
  {
  }

  caricaFile(event: any, node: MonsterNode): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for(let i=0; i<fileList.length; i++)
      {
        this.driveService.uploadFile(fileList[i] as Blob,node.id ).subscribe(x=>
          {
          });
      }
    }
  }

  matchesFilter() {
    const filterText = this.filterText.toLowerCase(); // Converto il filtro in minuscolo per una corrispondenza senza distinzioni tra maiuscole e minuscole
    if(filterText.length>=2)
    {
      var nodes = new Array<MonsterNode>();
      this.dataSource.data.forEach(folder=> {
        var node = new MonsterNode(folder.id, folder.mimeType, folder.name, folder.folders, folder.url);
        var data= folder.folders.filter(x=> x.name.toLowerCase().startsWith(filterText));
        if(data.length>0 || node.name.toLowerCase().startsWith(filterText))
        {
          var flag=false;
          if( node.name.toLowerCase().startsWith(filterText))
            flag=true;
          if(data.length>0 && !flag)
            node.folders=data;

          nodes.push(node);
        }
      })
      this.dataSource.data=nodes;
    }
    else
      this.dataSource.data=this.allData;
  }

}


  

  

