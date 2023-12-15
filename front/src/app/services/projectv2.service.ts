import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/project/Task';
import { Ressources } from 'src/app/models/project/Ressources';
import { Budget } from 'src/app/models/project/Budget';
import { Label } from '../models/project/Label';




@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  apiUrl = `${environment.origin}projet`;

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

  getProjectsAsAdmin(userid: string): Promise<Project[]> {
    const url = `${this.apiUrl}/getProjectsAsAdmin/${userid}`;

    return new Promise<Project[]>((resolve, reject) => {
      this.httpClient.get<Project[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet récuperé')
      });
    });
  }

  // suppression d'une project
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
  //RECUPERATION D4UN PROJECT PAR ID
  getProject(id: string): Promise<Project> {
    const url = `${this.apiUrl}/get-project/${id}`;

    return new Promise<Project>((resolve, reject) => {
      this.httpClient.get<Project>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet récuperé')
      });
    });
  }

  // update project
  putProject(project: Project): Promise<any> {
    const url = `${this.apiUrl}/put-project`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<Project>(url, project, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Projet modifié')
      });
    });
  }



  /** Task part */

  // create new task
  postTask(task: Task): Promise<any> {
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
  getTasksByIdProject(id: string): Promise<Task[]> {
    const url = `${this.apiUrl}/get-tasks/${id}`;

    return new Promise<Task[]>((resolve, reject) => {
      this.httpClient.get<Task[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches du projet récuperés')
      });
    });
  }
  //get all task
  getTasks(): Promise<Task[]> {
    const url = `${this.apiUrl}/gettasks`;

    return new Promise<Task[]>((resolve, reject) => {
      this.httpClient.get<Task[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches récuperés')
      });
    });
  }
  // get task by id task
  getTask(id: string): Promise<Task> {
    const url = `${this.apiUrl}/get-task/${id}`;

    return new Promise<Task>((resolve, reject) => {
      this.httpClient.get<Task>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche récuperé')
      });
    });
  }
  // get task by id ticket
  getTaskbyticket(id: string): Promise<Task> {
    const url = `${this.apiUrl}/get-tasks-by-id-ticket/${id}`;

    return new Promise<Task>((resolve, reject) => {
      this.httpClient.get<Task>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche récuperé')
      });
    });
  }

  // get task by id agent
  getTaskbyagent(id: string): Promise<Task[]> {
    const url = `${this.apiUrl}/get-tasks-by-id-agent/${id}`;

    return new Promise<Task[]>((resolve, reject) => {
      this.httpClient.get<Task[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches de l agent récuperés')
      });
    });
  }
  // update task
  putTask(task: Task): Promise<any> {
    const url = `${this.apiUrl}/put-task`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Task>(url, task, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâche modifié')
      });
    });
  }

  // suppression d'une tache
  deleteTask(id: string): Promise<any> {
    const url = `${this.apiUrl}/delete-task/${id}`

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete<Task>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches supprimé')
      });
    });
  }


  /** ressource part */

  // create new task
  postRessources(ressources: Ressources): Promise<any> {
    const url = `${this.apiUrl}/post-ressources`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Ressources>(url, ressources, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ressource créée')
      });
    });
  }
  //get ressources by id project
  getRessourcesByIdProject(id: string): Promise<Ressources[]> {
    const url = `${this.apiUrl}/get-ressourcess/${id}`;

    return new Promise<Ressources[]>((resolve, reject) => {
      this.httpClient.get<Ressources[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ressources du projet récuperés')
      });
    });
  }

  getRessources(id: string): Promise<Ressources> {
    const url = `${this.apiUrl}/get-ressources/${id}`;

    return new Promise<Ressources>((resolve, reject) => {
      this.httpClient.get<Ressources>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('ressource récuperé')
      });
    });
  }


  // update ressources
  putRessources(ressources: Ressources): Promise<any> {
    const url = `${this.apiUrl}/put-ressources`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Ressources>(url, ressources, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ressource modifié')
      });
    });
  }

  //delete ressources

  deleteRessources(id: string): Promise<any> {
    const url = `${this.apiUrl}/delete-ressources/${id}`

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete<Ressources>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Tâches supprimé')
      });
    });
  }

  /** Budget part */

  // create new Budget
  postBudget(budget: Budget): Promise<any> {
    const url = `${this.apiUrl}/post-budget`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Budget>(url, budget, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Budget créée')
      });
    });
  }
  //get Budget by id project
  getBudgetByIdProject(id: string): Promise<Budget[]> {
    const url = `${this.apiUrl}/get-budgets/${id}`;

    return new Promise<Budget[]>((resolve, reject) => {
      this.httpClient.get<Budget[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Budget du projet récuperés')
      });
    });
  }

  getBudget(id: string): Promise<Budget> {
    const url = `${this.apiUrl}/get-budget/${id}`;

    return new Promise<Budget>((resolve, reject) => {
      this.httpClient.get<Budget>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Budget récuperé')
      });
    });
  }

  // update budget
  putBudget(budget: Budget): Promise<any> {
    const url = `${this.apiUrl}/put-budget`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Budget>(url, budget, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('budget modifié')
      });
    });
  }

  //delete budget

  deleteBudget(id: string): Promise<any> {

    const url = `${this.apiUrl}/delete-budget/${id}`

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete<Budget>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Budjet supprimé')
      });
    });
  }


  //document
  uploadFile(formData: FormData) {
    const url = `${this.apiUrl}/uploadFile/`;

    return this.httpClient.post<Task>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  downloadFile(_id: string, file_id: string, path: string) {
    const url = `${this.apiUrl}/downloadFile/${_id}/${file_id}/${path}`

    return this.httpClient.get<{ file: string, documentType: string }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  insertDB(data: { toInsert: Task[], toUpdate: Task[] }) {
    let registreUrl = this.apiUrl + "insertDB"
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  // '/get-budget-file/:id'
  downloadFileOfBudget(_id: string) {
    const url = `${this.apiUrl}/get-budget-file/${_id}`
    return this.httpClient.get<{ file: string, documentType: string }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createLabel(label: Label) {
    const url = `${this.apiUrl}/ajout-label`
    return this.httpClient.post<Label>(url, label, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getLabels() {
    const url = `${this.apiUrl}/get-labels`
    return this.httpClient.get<Label[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  updateLabel(label: Label) {
    const url = `${this.apiUrl}/update-label`
    return this.httpClient.put<Label>(url, label, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  deleteLabel(id) {
    const url = `${this.apiUrl}/delete-label/${id}`
    return this.httpClient.delete<Label>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

}

