import { Injectable } from '@angular/core';
import data from './data.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data = data;

  constructor() { }

  getData() {
    return this.data;
  }
  
}