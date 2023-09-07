import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DataService } from 'src/app/shared/data.service';

interface Module {
  name: string;
  type?: string;
  style?: string;
  input?: object[] | null;
  output?: object[] | null;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data = this.dataService.getData().modules.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));

  public list: Module[] = [];
  displayedColumns: string[] = ['amount', 'name', 'type'];

  @ViewChild(MatTable) table: MatTable<any> | undefined;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    
  }


  addToList(module: Module) {
    console.log("Selected:", module);
    if (this.list.some(item => item.name === module.name)) {
      // set amount +1 if already in list
      this.list.forEach(item => {
        if (item.name === module.name) {
          item.amount++;
        }
      });
    } else {
      let newModule = { ...module, amount: 1 };
      this.list.push(newModule);
    }
    this.table?.renderRows();
  }



}
