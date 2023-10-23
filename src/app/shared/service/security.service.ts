import {Injectable} from '@angular/core';
import {CredentialLogin} from "../model/credentialLogin.model";
import {AxiosService} from "./axios.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  authenticated = false;
  private loggedInSubject = new BehaviorSubject<boolean>(this.authenticated);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private axiosService: AxiosService, private router: Router) {}

  public setLoggedInStatus(isLoggedIn: boolean) {
    this.authenticated = isLoggedIn;
    this.loggedInSubject.next(isLoggedIn);
  }

  public signInEmployee(input: CredentialLogin) {
    this.axiosService.request("POST", "/login", {
      username: input.username,
      password: input.password
    }).then(
      response => {
        this.axiosService.setAuthToken(response.data.token);
        this.setLoggedInStatus(true);
        this.router.navigate(['/dashboard']);
      }).catch(
      error => {
        this.axiosService.setAuthToken(null);
        //Notification in frontend
      }
    );
  }
}
