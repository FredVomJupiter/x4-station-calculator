import { Injectable } from '@angular/core';
import json from './data.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data = json;

  constructor() { }

  getData() {
    return this.data;
  }
  
}