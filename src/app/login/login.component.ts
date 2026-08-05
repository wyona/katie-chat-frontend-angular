import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentDataSharingService } from '../component-data-sharing.service';
import { Username } from '../models/username.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginFailed: boolean = false;
  loginFailedMsg: string = "";
  loginSuccessful: boolean = false;

  /**
   *
   */
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private dataSharingService: ComponentDataSharingService) {
    console.info("Loading LoginComponent ...");
  }

  /**
   *
   */
  doLogin(email: string, password: string): void {
    //alert("DEBUG: Login ...");
    console.info("LoginComponent#doLogin(): Login ...");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    var apiUrl = "./api/v1/auth/login?rememberMe=true";

    this.httpClient.post(apiUrl, { email, password }, httpOptions)
      .toPromise()
      .then(response => {
        console.info("Login successfull.");
        this.loginFailed = false;
        this.loginSuccessful = true;
        var username = <Username>response;
        this.dataSharingService.username.next(username.username);
        this.router.navigate(['/']);
      })
      .catch(response => {
        console.warn("LoginComponent#doLogin(): Login failed: Response status: " + response.status);
        this.loginFailed = true;
        this.loginFailedMsg = response.error['message']; // INFO: This works, because we use httpClient instead http
        this.loginSuccessful = false;
      });
  }
}
