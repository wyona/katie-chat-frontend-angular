import { Component } from '@angular/core';
import { ChatGptService } from '../chat-gpt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registrationFailed: boolean = false;
  errorMsg: string = "";
  registrationSuccessful: boolean = false;
  email: string | null = null;

  /**
   *
   */
  constructor(private chatGptService: ChatGptService) {
  }

  /**
   * Register user
   * @param email Email of user, e.g. "michael.wechner@wyona.com"
   * @param firstName First name of user, e.g. "Michael"
   * @param lastName Last name of user, e.g. "Wechner"
   */
  doRegister(email: string, firstName: string, lastName: string): void {
    //alert("RegisterComponent#doRegister(): " + email + ", " + firstName + ", " + lastName);

    if (!email) {
      alert("E-Mail must not be empty!");
      return;
    }
    if (!firstName) {
      alert("First name must not be empty!");
      return;
    }
    if (!lastName) {
      alert("Lastname must not be empty!");
      return;
    }

    var language = "en"; //this.translateService.currentLang;
    var linkedInUrl = "";
    var learn_about_katie = "";
    var usage = "";
    var expectations = "";
    this.chatGptService.selfRegister(email, firstName, lastName, language).then(response => {
      //alert("User self-registered successfully.");
      this.email = email;
      this.registrationSuccessful = true;
      this.registrationFailed = false;
    })
    . catch (response => {
      this.registrationSuccessful = false;
      this.registrationFailed = true;
      this.errorMsg = <string>response;
      console.error("RegisterComponent#register(): Error occured while trying to self-register: " + this.errorMsg);
      //alert("RegisterComponent#register(): Error occured while trying to self-register: " + this.errorMsg);
    });
  }
}
