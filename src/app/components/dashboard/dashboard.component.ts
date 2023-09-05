import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

interface Module {
  name?: string;
  type?: string;
  style?: string;
  input?: object[] | null;
  output?: object[] | null;
  amount?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data = this.dataService.getData().modules;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.data.forEach((module: Module) => {
      console.log(module);
    });
  }


}
