import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskComponent} from "./component/task/task.component";

const routes: Routes = [
  //TODO: Redirect to login only if user is loggedOut
  { path: '', redirectTo: 'task/0', pathMatch: 'full' },
  { path: 'task/:id', component: TaskComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
