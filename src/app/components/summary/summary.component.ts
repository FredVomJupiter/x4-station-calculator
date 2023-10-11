import { Component, EventEmitter, Input, Output } from '@angular/core';


interface Module {
  name: string;
  type: string;
  style: string;
  input: { name: string, amount: number }[] | null;
  output: { name: string, amount: number }[] | null;
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

  // This array is used to toggle the details of a module.
  // If an index is in the array, the respective details are shown.
  toggle: number[] = [];


  constructor() { }

  /**
   * Toggles the summary component.
   */
  toggleSummary() {
    if (this.open == true) {
      this.open = false;
      this.summaryOpen.emit(false);
      this.toggle = []; // Closing all details when summary is closed.
    } else {
      this.open = true;
      this.summaryOpen.emit(true);
    }
  }

  /**
   * Determines whether the details of a module are shown or not.
   * If the details are shown, the index of the module is added to the toggle array.
   * @param index The index of the module in the list.
   */
  toggleDetails(index: number) {
    if (this.toggle.includes(index)) {
      this.toggle.splice(this.toggle.indexOf(index), 1);
    } else {
      this.toggle.push(index);
    }
  }

  /**
   * 
   * @param index The index of the module in the list.
   * @returns true if the details of the module are shown, false if not.
   */
  check(index: number) {
    return this.toggle.includes(index);
  }

}
