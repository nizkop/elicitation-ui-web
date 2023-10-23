import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Task} from "../model/Task";
// @ts-ignore
import tasks from "../../../assets/tasks.json";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks:{title:String, description:String,group:String}[] = tasks;
}
