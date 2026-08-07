import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ComponentDataSharingService } from '../component-data-sharing.service';
import { User } from '../models/user.model';
import { AccessToken } from '../models/access-token.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  username: string | null = null;
  user: User | null = null;

  /**
   *
   */
  constructor(private httpClient: HttpClient, private dataSharingService: ComponentDataSharingService) {
    this.getUser();

    this.dataSharingService.username.subscribe( value => {
      this.username = value;
      if (this.username != null) {
        this.getAccessToken();
      } else {
        console.info("HeaderComponent(): User not authenticated yet.");
      }
    });
  }

  /**
   * Get user information (assuming that user is signed-in by session)
   */
  getUser(): void {
    //alert("DEBUG: Get user information ...");
    console.info("HeaderComponent#getUser(): Get user information ...");
    var requestUrl = "./api/v1/auth/user";

    this.httpClient.get(requestUrl, { responseType: 'json' })
      .toPromise()
      .then(response => {
        this.user = <User>response;
        this.username = this.user.username;
        //alert("Username: " + this.username);
        console.info("HeaderComponent#getUser(): Username: " + this.username + ", E-Mail: " + this.user.email);
        this.dataSharingService.username.next(this.username);
      })
      .catch(response => {
        //alert("Not authenticated yet.");
        var error = <Error>response.error; // INFO: This works, because we use httpClient instead http
        if (response.status === 403) {
          console.info("HeaderComponent#getUser(): User not authenticated yet, therefore user object not available.");
        } else {
          console.error("HeaderComponent#getUser(): Response status: " + response.status);
          alert("An error occured: " + error.message);
        }
      });
  }

  /**
   * Get access token (assuming that user is signed-in by session)
   */
  getAccessToken(): void {
    //alert("DEBUG: Get access token ...");
    console.info("HeaderComponent#getAccessToken(): Get access token ...");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    var requestUrl = "./api/v1/auth/token/myself?addProfile=false&seconds=3600";

    this.httpClient.post(requestUrl, httpOptions)
      .toPromise()
      .then(response => {
        console.info("HeaderComponent#getAccessToken(): Get access token successfull.");
        var accessToken = <AccessToken>response;
        //alert("DEBUG: Access token: " + accessToken.access_token);
        this.dataSharingService.accessToken.next(accessToken.access_token);
      })
      .catch(response => {
        console.warn("HeaderComponent#getAccessToken(): Get access token failed: Response status: " + response.status);
      });
  }
}
