import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ComponentDataSharingService } from '../component-data-sharing.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  /**
   *
   */
  constructor(private router: Router, private dataSharingService: ComponentDataSharingService, private httpClient: HttpClient) {
    this.doLogout();
  }

  /**
   *
   */
  doLogout(): void {
    console.info("Logout ...");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    var apiUrl = "./api/v1/auth/logout";

    this.httpClient.get(apiUrl, httpOptions)
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
