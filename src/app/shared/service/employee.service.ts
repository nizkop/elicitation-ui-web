import { Injectable } from '@angular/core';
import {catchError, from, map, Observable, throwError} from "rxjs";
import {AxiosService} from "./axios.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private axiosService: AxiosService) {
  }

  /*
  public findAll(): Observable<Employee[]> {
    return from(this.axiosService.request("GET", "/employee", null)).pipe(
      map(response => {
        console.log('Employees Service: ', response.data);
        return response.data;
      }),
      catchError(error => {
        console.error("Fehler bei der GET-Anfrage:", error);
        return throwError(error);
      })
    );
  }

  //TODO
  public save(employee: Employee) {
    this.axiosService.request(
      "POST",
      "/employee",
      employee).then(
      response => {
        //Erfolgreich erstellt anzeigen
      }).catch(
      error => {
        //Notification in frontend
      }
    );
  }

  delete(id: string) {
    return this.axiosService.request('DELETE', `/employee/${id}`, null);
  }

   */
}
