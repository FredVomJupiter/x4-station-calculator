import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material/dialog';

import { DeleteComponent } from 'src/app/dialog/delete/delete.component';

interface Module {
  name: string;
  type: string;
  style: string;
  input: object[] | null;
  output: object[] | null;
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
  copy: Module[] = [];
  filtering: boolean = false;
  selection: Module[] = [];
  displayedColumns: string[] = ['amount', 'name', 'type'];

  @ViewChild(MatTable) table: MatTable<any> | undefined;


  constructor(
    private dataService: DataService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {

  }


  addToList(module: Module) {
    this.exists(module) ? this.remove(module) : this.list.push({ ...module, amount: 1 });
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
    this.copy = this.copy.filter(item => item.name !== module.name);
    this.table?.renderRows();
  }


  removeAll() {
    this.list = [];
    this.copy = [];
    this.selection = [];
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


  applyFilter(event: Event) {
    this.doPrechecks();
    let filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '') {
      this.resetFilter();
    } else {
      this.useFilter(filterValue);
    }
  }


  doPrechecks() {
    this.filtering === false ? this.copy = this.list : null;
    this.filtering = true;
  }


  resetFilter() {
    this.list = this.copy;
    this.filtering = false;
  }


  useFilter(filterValue: string) {
    let trimLow = filterValue.trim().toLowerCase();
    this.list = this.list.filter((module) => {
      return (module.name.trim().toLowerCase().includes(trimLow) || module.type.trim().toLowerCase().includes(trimLow));
    });
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.removeAll();
      }
    });
  }

}
