import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ComponentDataSharingService } from '../component-data-sharing.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  accessToken: string | null = null;

  /**
   *
   */
  constructor(private router: Router, private dataSharingService: ComponentDataSharingService, private http: HttpClient) {
    this.dataSharingService.accessToken.subscribe( value => {
      this.accessToken = value;
    });

    this.doLogout();
  }

  /**
   *
   */
  doLogout(): void {
    console.info("Logout ...");

    type Body = {[key: string] : any};
    const body: Body = {};

    type Headers = {[key: string] : any};
    const headers: Headers = {};
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = 'Bearer ' + this.accessToken;

    this.http.post(environment.logoutUrl, body, { headers })
      .toPromise()
      .then(response => {
        console.info("Logout successful");

        this.dataSharingService.username.next(null);
        this.dataSharingService.accessToken.next("NO_TOKEN_AVAILABLE");

        this.router.navigate(['/']);
      })
      .catch(response => {
        console.error("Logout failed: " + response.status);
        alert("Logout failed: " + response.status);
      });
  }
}
