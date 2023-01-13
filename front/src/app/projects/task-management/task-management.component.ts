import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project/Project';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {

  loading:boolean = true;

  /** project */
  projects: Project[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  // get all classes we need
  onGetAllClasses(): void 
  {}

}
