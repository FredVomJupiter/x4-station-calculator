import { Component, EventEmitter, Input, Output } from '@angular/core';


interface Module {
  name: string;
  type: string;
  style: string;
  input: object[] | null;
  output: object[] | null;
  amount: number;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  // Open is used to toggle the summary component here.
  open: boolean = false;
  // If summary is open, tell dashboard component to prevent scrolling or vice versa.
  @Output() summaryOpen = new EventEmitter<boolean>();
  // If dashboard component is scrolled to the bottom, hide the summary component.
  @Input() hide: boolean = false;

  @Input() list: Module[] = [];


  constructor() { }


  toggleSummary() {
    if (this.open == true) {
      this.open = false;
      this.summaryOpen.emit(false);
    } else {
      this.open = true;
      this.summaryOpen.emit(true);
    }
  }

}
