import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComponentDataSharingService } from '../component-data-sharing.service';
import { User } from '../models/user.model';
import { AccessToken } from '../models/access-token.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  username: string | null = null;
  user: User | null = null;
  
  // Keep long lived subscription even if the component dies, because user might switch to another page
  private serviceSubscription: Subscription = new Subscription();

  constructor(
    private httpClient: HttpClient, 
    private dataSharingService: ComponentDataSharingService
  ) {}

  ngOnInit(): void {
    // Try to load user when class is initialized
    //this.getUser();

    // React to changes of Service-value
    const usernameSub = this.dataSharingService.username.subscribe({
      next: (value) => {
        this.username = value;
        if (this.username != null) {
          console.info("HeaderComponent: Username changed: " + this.username);
          //this.getAccessToken();
        } else {
          console.info("HeaderComponent: No username available.");
          //console.info("HeaderComponent: Do not get access token, because user not authenticated yet.");
        }
      }
    });
    
    this.serviceSubscription.add(usernameSub);
  }

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
  }

  /**
   * Get user information (assuming that user is signed-in by session)
   */
  getUser(): void {
    alert("DEBUG: Get user details ...");
    console.info("HeaderComponent#getUser(): Get user details ...");
    const requestUrl = "./api/v1/auth/user";

    this.httpClient.get<User>(requestUrl).subscribe({
      next: (response) => {
        this.user = response;
        this.username = this.user.username;
        console.info(`HeaderComponent#getUser(): Username: ${this.username}, E-Mail: ${this.user.email}`);
        
        // Trigger DataSharingService
        this.dataSharingService.username.next(this.username);
      },
      error: (response) => {
        const error = response.error as Error;
        if (response.status === 403) {
          console.info("HeaderComponent#getUser(): User not authenticated yet, therefore user object not available.");
        } else {
          console.error(`HeaderComponent#getUser(): Response status: ${response.status}`);
          alert(`An error occurred: ${error?.message || response.message}`);
        }
      }
    });
  }

  /**
   * Get access token (assuming that user is signed-in by session)
   */
  getAccessToken(): void {
    alert("DEBUG: Get access token ...");
    console.info("HeaderComponent#getAccessToken(): Get access token ...");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const requestUrl = "./api/v1/auth/token/myself?addProfile=false&seconds=3600";

    this.httpClient.post<AccessToken>(requestUrl, {}, httpOptions).subscribe({
      next: (response) => {
        console.info("HeaderComponent#getAccessToken(): Get access token successful.");
        this.dataSharingService.accessToken.next(response.access_token);
      },
      error: (response) => {
        console.warn(`HeaderComponent#getAccessToken(): Get access token failed: Response status: ${response.status}`);
      }
    });
  }
}
