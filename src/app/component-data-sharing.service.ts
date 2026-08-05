import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentDataSharingService {

  public username: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);
  public accessToken: BehaviorSubject<string> = new BehaviorSubject<string>("");

  /**
   *
   */
  constructor() { }
}
