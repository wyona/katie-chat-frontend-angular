import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentDataSharingService } from '../component-data-sharing.service';
import { environment } from 'src/environments/environment';
import { Username } from '../models/username.model';
import { Token } from '../models/token.model';

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

    console.info("Try to login at " + environment.loginUrl);

    this.httpClient.post(environment.loginUrl, { email, password }, httpOptions)
      .toPromise()
      .then(response => {
        this.loginFailed = false;
        this.loginSuccessful = true;

        //var token = <Token>response;
        //console.info("Login successfull: " + token.token);
        //this.dataSharingService.username.next(email);
        //this.dataSharingService.accessToken.next(token.token);

        var username = <Username>response;
        console.info("LoginComponent#doLogin(): Login successfull: " + username.username);
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
