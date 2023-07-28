import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/models/Project';
import { Task} from 'src/app/models/project/Task';



@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:3000/soc/projet';
    //apiUrl = `${environment.origin}project`;

    constructor(private httpClient: HttpClient) { }

    /** Project part */

    // create a new project
    postProject(project: Project): Promise<any> {
        console.log("2222222")

        const url = `${this.apiUrl}/create-project`;

        return new Promise<any>((resolve, reject) => {
            this.httpClient.post<Project>(url, project, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
                next: (response) => resolve(response),
                error: (error) => reject(error),
                complete: () => console.log('Projet crée')
            });
        });
    }
    //recuperation des projects

    async getProjects(): Promise<Project[]> {
        const response = await this.httpClient.get<Project[]>(`${this.apiUrl}/recuperation`, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).toPromise();
        return response || [];
    }

    // suppression d'une tache
    delete(id: string): Promise<any> {
        const url = `${this.apiUrl}/delete/${id}`

        return new Promise<any>((resolve, reject) => {
            this.httpClient.delete<Project>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
                next: (response) => resolve(response),
                error: (error) => reject(error),
                complete: () => console.log('Project supprimé')
            });
        });
    }



    /** Task part */

  // create new task
  postTask(task: Task): Promise<any>
  {
    const url = `${this.apiUrl}/post-task`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Task>(url, task, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche créée')
      });
    });
  }

  // get tasks by id project
  getTasksByIdProject(id: string): Promise<Task[]>
  {
    const url = `${this.apiUrl}/get-tasks/${id}`;

    return new Promise<Task[]>((resolve, reject) => {
      this.httpClient.get<Task[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches du projet récuperés')
      });
    });
  }

}
