import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project/Project';
import { Tache } from '../models/project/Tache';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  apiUrl = `${environment.origin}project`;

  constructor(private httpClient: HttpClient) { }

  /** Project part */

  // create a new project
  postProject(project: Project): Promise<any> 
  {
    const url = `${this.apiUrl}/post-project`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<Project>(url, project, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet crée')
      });
    });
  }

  // update project
  putProject(project: Project): Promise<any> 
  {
    const url = `${this.apiUrl}/put-project`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<Project>(url, project, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet modifié')
      });
    });
  }

  // get all project
  getProjects(): Promise<Project[]>
  {
    const url = `${this.apiUrl}/get-projects`;

    return new Promise<Project[]>((resolve, reject) => {
      this.httpClient.get<Project[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projets récuperés')
      });
    });
  }
  
  // get project by id
  getProject(id: string): Promise<Project>
  {
    const url = `${this.apiUrl}/get-project/${id}`;

    return new Promise<Project>((resolve, reject) => {
      this.httpClient.get<Project>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet récuperé')
      });
    });
  }

  /** Task part */

  // create new task
  postTask(task: Tache): Promise<any>
  {
    const url = `${this.apiUrl}/post-task`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Tache>(url, task, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche créée')
      });
    });
  }

  // update task
  putTask(task: Tache): Promise<any>
  {
    const url = `${this.apiUrl}/put-task`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Tache>(url, task, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche modifié')
      });
    });
  }

  // get all tasks
  getTasks(): Promise<Tache[]>
  {
    const url = `${this.apiUrl}/get-tasks`;

    return new Promise<Tache[]>((resolve, reject) => {
      this.httpClient.get<Tache[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches récuperés')
      });
    });
  }

  // get task by id task
  getTask(id: string): Promise<Tache>
  {
    const url = `${this.apiUrl}/get-task/${id}`;

    return new Promise<Tache>((resolve, reject) => {
      this.httpClient.get<Tache>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche récuperé')
      });
    });
  }

  // get tasks by id project
  getTasksByIdProject(id: string): Promise<Tache[]>
  {
    const url = `${this.apiUrl}/get-tasks/${id}`;

    return new Promise<Tache[]>((resolve, reject) => {
      this.httpClient.get<Tache[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches du projet récuperés')
      });
    });
  }

  // get tasks by id user
  getTasksByIdUser(id: string): Promise<Tache[]>
  {
    const url = `${this.apiUrl}/get-tasks-by-id-user/${id}`;

    return new Promise<Tache[]>((resolve, reject) => {
      this.httpClient.get<Tache[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches du projet récuperés')
      });
    });
  }


  // get tasks in progress by id user
  getTasksInProgressByIdUser(id: string): Promise<Tache[]>
  {
    const url = `${this.apiUrl}/get-tasks-in-progress-by-id-user/${id}`;

    return new Promise<Tache[]>((resolve, reject) => {
      this.httpClient.get<Tache[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches en cours du projet récuperés')
      });
    });
  }
  
  
  // get tasks finished by id user
  getTasksFinishedByIdUser(id: string): Promise<Tache[]>
  {
    const url = `${this.apiUrl}/get-tasks-finished-by-id-user/${id}`;

    return new Promise<Tache[]>((resolve, reject) => {
      this.httpClient.get<Tache[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches finis du projet récuperés')
      });
    });
  }


  // suppression d'une tache
  deleteTask(id: string): Promise<any> 
  {
    const url = `${this.apiUrl}/delete-task/${id}`

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete<Tache>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches supprimé')
      });
    });
  }

}
