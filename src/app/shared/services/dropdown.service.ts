import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EstadosBr } from '../models/estadosbr.model';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private httpClient: HttpClient) {}

  getEstadosBr(): Observable<EstadosBr[]> {
    return this.httpClient
      .get<EstadosBr[]>('assets/dados/estadosbr.json')
      .pipe(map((res) => res));
  }
}
