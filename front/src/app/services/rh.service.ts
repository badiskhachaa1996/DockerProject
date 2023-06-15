import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RhService {

  endPoint: string = `${environment.origin}rh`;

  constructor(private httpClient: HttpClient) { }
}
