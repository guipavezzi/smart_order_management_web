import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMenuRequest, MenuResponse } from '../models/menu.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getMenus(): Observable<MenuResponse[]> {
    return this.http.get<MenuResponse[]>(this.apiUrl);
  }

  createMenu(request: CreateMenuRequest): Observable<MenuResponse> {
    return this.http.post<MenuResponse>(this.apiUrl, request);
  }

  updateMenu(id: string, request: CreateMenuRequest): Observable<MenuResponse> {
    return this.http.put<MenuResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteMenu(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
