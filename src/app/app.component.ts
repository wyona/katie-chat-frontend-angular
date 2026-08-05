import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatGptService } from './chat-gpt.service';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Message } from './models/message.model';
import { ErrorResponse } from './models/chat-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/chat";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userMessage = '';
  //conversation: Message[] = [ { role: 'system', content: 'TODO: Move system prompt to backend' } ];
  conversation: Message[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  /**
   *
   */
  constructor(private chatGptService: ChatGptService) {
  }
}
