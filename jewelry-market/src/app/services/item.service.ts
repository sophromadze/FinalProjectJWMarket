import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JewelryItem } from '../models/jewelry-item.model'; // Ensure this path is correct

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private baseUrl = 'https://localhost:7146/api/jewelryitems';

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<JewelryItem[]> {
    return this.http.get<JewelryItem[]>(this.baseUrl);
  }

  getItemsByCategory(category: number): Observable<JewelryItem[]> {
    return this.http.get<JewelryItem[]>(`${this.baseUrl}?category=${category}`);
  }

  getItemById(id: number): Observable<JewelryItem> {
    return this.http.get<JewelryItem>(`${this.baseUrl}/${id}`);
  }

  addItem(item: JewelryItem): Observable<JewelryItem> {
    return this.http.post<JewelryItem>(`${this.baseUrl}/additem`, item);
  }

  updateItem(id: number, item: JewelryItem): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
