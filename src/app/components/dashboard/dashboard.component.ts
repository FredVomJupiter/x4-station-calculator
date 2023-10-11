import { Component, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material/dialog';

import { DeleteComponent } from 'src/app/dialog/delete/delete.component';

interface Module {
  name: string;
  type: string;
  style: string;
  input: { name: string, amount: number }[] | null;
  output: { name: string, amount: number }[] | null;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Store the data from the data service in a variable for the table.
  data = this.dataService.getData().modules
    .sort((a: { name: string; }, b: { name: string; }) =>
      a.name.localeCompare(b.name));

  @Output() public list: Module[] = [];
  @Output() inputs: { name: string, amount: number }[] = [];
  @Output() outputs: { name: string, amount: number }[] = [];
  @Output() deficit: { name: string, amount: number }[] = [];
  @Output() surplus: { name: string, amount: number }[] = [];

  copy: Module[] = [];
  filtering: boolean = false;
  selection: string[] = [];
  displayedColumns: string[] = ['amount', 'name', 'type'];

  @ViewChild(MatTable) table: MatTable<any> | undefined;


  // This is the variable that is used to hide the summary component when the user scrolls down.
  @Output() hide: boolean = false;

  // This is the function that is used to hide the summary component when the user scrolls down.
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: any) {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;

    if (pos === max) {
      console.log("bottom");
      this.hide = true;
    } else {
      this.hide = false;
    }
  }


  constructor(
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }


  addToList(module: Module) {
    this.exists(module) ? this.remove(module) : this.list.push({ ...module, amount: 1 });
    this.list.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
    this.table?.renderRows();
    this.calculate();
  }


  exists(module: Module) {
    return this.list.some(item => item.name === module.name);
  }


  increaseAmount(module: Module) {
    this.list.forEach(item => {
      if (item.name === module.name) {
        item.amount++;
        this.calculate();
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
        this.calculate();
      }
    });
  }


  remove(module: Module) {
    this.list = this.list.filter(item => item.name !== module.name);
    this.copy = this.copy.filter(item => item.name !== module.name);
    this.selection = this.selection.filter(item => item !== module.name);
    this.table?.renderRows();
    this.calculate();
  }


  removeAll() {
    this.list = [];
    this.copy = [];
    this.selection = [];
    this.table?.renderRows();
    this.calculate();
  }


  setAmount(module: Module) {
    let amount = this.getInputValueAsNumber(module);
    if (amount >= 0) {
      this.setAmountNumber(module, amount);
      this.calculate();
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


  preventScolling($event: any) {
    if ($event == true) {
      document.body.style.overflow = 'hidden';
      document.documentElement.scrollTop = 0;
    } else {
      document.body.style.overflow = 'auto';
    }
  }


  calculate() {
    this.calculateInput();
    this.calculateOutput();
    this.calculateDeficit();
    this.calculateSurplus();
  }


  calculateInput() {
    this.inputs = [];
    this.list.forEach(module => {
      if (module.input != null) {
        module.input.forEach(input => {
          if (this.inputs.find(i => i.name == input.name)) {
            this.inputs.find(i => i.name == input.name)!.amount += input.amount * module.amount;
          } else {
            this.inputs.push({ name: input.name, amount: input.amount * module.amount });
          }
        });
      }
    });
  }


  calculateOutput() {
    this.outputs = [];
    this.list.forEach(module => {
      if (module.output != null) {
        module.output.forEach(output => {
          if (this.outputs.find(i => i.name == output.name)) {
            this.outputs.find(i => i.name == output.name)!.amount += output.amount * module.amount;
          } else {
            this.outputs.push({ name: output.name, amount: output.amount * module.amount });
          }
        });
      }
    });
  }


  calculateDeficit() {
    this.deficit = [];
    this.inputs.forEach(input => {
      if (this.outputs.find(i => i.name == input.name)) {
        this.deficit.push({ name: input.name, amount: input.amount - this.outputs.find(i => i.name == input.name)!.amount });
      } else {
        this.deficit.push({ name: input.name, amount: input.amount });
      }
    });
  }


  calculateSurplus() {
    this.surplus = [];
    this.outputs.forEach(output => {
      if (this.inputs.find(i => i.name == output.name)) {
        this.surplus.push({ name: output.name, amount: output.amount - this.inputs.find(i => i.name == output.name)!.amount });
      } else {
        this.surplus.push({ name: output.name, amount: output.amount });
      }
    });
  }

}
