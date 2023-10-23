import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SecurityService} from "../../shared/service/security.service";
import {CredentialLogin} from "../../shared/model/credentialLogin.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output() onSubmitLoginEvent = new EventEmitter();

  username!: "";
  password!: "";

  constructor(private securityService: SecurityService) {
  }

  onSubmitLogin() {
    //TODO: implement onSubmitLoginEvent correctly
    this.onSubmitLoginEvent.emit({"username": this.username, "password": this.password});
    console.log(this.username, this.password);

    const credential: CredentialLogin = { username: this.username, password: this.password };

    this.securityService.signInEmployee(credential);
  }
}
