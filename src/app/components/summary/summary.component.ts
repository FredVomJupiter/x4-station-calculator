import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  // Data send to dashboard component.
  open: boolean = false;
  @Output() summaryOpen = new EventEmitter<boolean>();
  // Data coming from dashboard component.
  @Input() hide: boolean = false;


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
