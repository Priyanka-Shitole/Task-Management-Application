import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
url="../"
  constructor(private http: HttpClient) { }

  getAllTasks() {
    return this.http.get('assets/AllProductsData.json');
  }
  updateTasks(id: any) {
    let data = { completed: true, }
    return this.http.put('https://dummyjson.com/todos/' + id, data);
  }
  deleteTask(id: any) {
    return this.http.delete('https://dummyjson.com/todos/' + id);
  }
}
