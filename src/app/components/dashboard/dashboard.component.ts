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

  data = this.dataService.getData().modules
  .sort((a: { name: string; }, b: { name: any; }) =>
  a.name.localeCompare(b.name));

  public list: Module[] = [];
  displayedColumns: string[] = ['amount', 'name', 'type'];

  @ViewChild(MatTable) table: MatTable<any> | undefined;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {

  }


  addToList(module: Module) {
    this.exists(module) ? this.increaseAmount(module) : this.list.push({ ...module, amount: 1 });
    this.table?.renderRows();
  }


  exists(module: Module) {
    return this.list.some(item => item.name === module.name);
  }


  increaseAmount(module: Module) {
    this.list.forEach(item => {
      if (item.name === module.name) {
        item.amount++;
      }
    });
  }


  decreaseAmount(module: Module) {
    this.list.forEach(item => {
      if (item.name === module.name) {
        if (item.amount > 1) {
          item.amount--;
        } else {
          this.remove(module);
        }
      }
    });
  }


  remove(module: Module) {
    this.list = this.list.filter(item => item.name !== module.name);
    this.table?.renderRows();
  }


  setAmount(module: Module) {
    let amount = this.getInputValueAsNumber(module);
    if (amount >= 0) {
      this.setAmountNumber(module, amount);
    } else {
      this.resetInputValue(module);
    }
  }


  getInputValueAsNumber(module: Module) {
    return Number((document.getElementById(`${module.name}`) as HTMLInputElement).value);
  }


  setAmountNumber(module: Module, amount: number) {
    this.list.forEach(item => {
      if (item.name === module.name) {
        item.amount = amount;
      }
    });
  }


  resetInputValue(module: Module) {
    this.list.forEach(item => {
      if (item.name === module.name) {
        (document.getElementById(`${module.name}`) as HTMLInputElement).value = String(item.amount);
      }
    });
  }

}
