import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  apiUrl = `${environment.origin}project`;

  constructor(private httpClient: HttpClient) { }

  /** Project part */

  // create a new project
  postProject(project: Project)
  {
    const url = `${this.apiUrl}/post-project`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Project>(url, project, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        
      );
    });
  }

}
