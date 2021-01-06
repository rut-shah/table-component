import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  API_URL = environment.apiUrl;

  constructor( private httpClient: HttpClient ) { }

  getInventoryData(): Observable<any> {
    return this.httpClient.get(this.API_URL + 'inventoryData');
  }

  modifyInventory(data: {}): Observable<any> {
    return this.httpClient.post(this.API_URL + 'modifyInventory', data);
  }

  updateStatus(data: {}): Observable<any> {
    return this.httpClient.post(this.API_URL + 'updateStatus', data);
  }

  deleteInventory(data: {}): Observable<any> {
    return this.httpClient.post(this.API_URL + 'deleteInventory', data);
  }
}
