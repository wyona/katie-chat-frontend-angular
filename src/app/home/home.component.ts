import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatGptService } from '../chat-gpt.service';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Message } from '../models/message.model';
import { ConversationStarter } from '../models/conversation-starter.model';
import { ErrorResponse } from '../models/chat-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { ComponentDataSharingService } from '../component-data-sharing.service';


@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userMessage = '';
  //conversation: Message[] = [ { role: 'system', content: 'TODO: Move system prompt to backend' } ];
  conversation: Message[] = [];
  conversation_id: string | null = null;
  responseReceived: boolean = true;
  conversationStarters: ConversationStarter[] = [];

  accessToken: string = "NO_TOKEN_AVAILABLE";

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  /**
   *
   */
  constructor(private chatGptService: ChatGptService, private dataSharingService: ComponentDataSharingService) {
    this.chatGptService.getConversationStarters().then(response => {
      this.conversationStarters = <ConversationStarter[]>response;
    });
    this.dataSharingService.accessToken.subscribe( value => {
      this.accessToken = value;
    });
  }

  /**
   * Stream response using SSE: https://www.npmjs.com/package/openai
   */
  async stream(messages: Array<Message>, chosenSuggestion: {type: string; index: string} | null): Promise<any> {
    console.info("HomeComponent#stream(): Stream response using SSE (Base URL: " + environment.baseUrl +") ...");

    var _apiKey = this.accessToken;
    if (environment.apiKey != null) {
      alert("DEBUG: API Key: " + environment.apiKey);
      _apiKey = environment.apiKey;
    }

    const client = new OpenAI({
      apiKey: _apiKey,
      baseURL: environment.baseUrl,
      dangerouslyAllowBrowser: true,
    });

/*
    type Body = {[key: string] : any};
    const body: Body = {};
    body['model'] = environment.model;
    body['messages'] = this.chatGptService.replaceRoleError(messages);
    body['temperature'] = environment.temperature;
    body['stream'] = true;
    if (chosenSuggestion != null) {
      body['chosen_suggestion'] = chosenSuggestion;
    }
*/

    type Role = 'function' | 'user' | 'assistant' | 'system' | 'tool';
    var openAIMessages: ChatCompletionMessageParam[] = [];
    for (var msg of messages) {
      var role: Role = 'user';
      if (msg.role == "assistant" || msg.role == "error") {
        role = 'assistant';
      } else if (msg.role == "system") {
        role = 'system';
      } else if (msg.role == "user") {
        role = 'user';
      }
      //alert("DEBUG: Role: " + role);
      openAIMessages.push({ role: role, content: msg.content });
    }

    // TODO
    if (chosenSuggestion != null) {
      openAIMessages.push({ role: 'system', content: 'Tell user, that conversation starters are not supported yet by streaming implementation.' });
    }

    //const stream = client!.chat.completions.create(body);
    const stream = client!.chat.completions
      .create({
        model: 'gpt-4o',
        messages: openAIMessages,
        temperature: environment.temperature,
        stream: true,
        //chosen_suggestion: {type: 'starter', index: 0}
      }).catch(async (err) => {
        var errorMsg = "Error status: " + err.status;
        console.error(errorMsg);
        this.conversation.push({ role: 'error', content: errorMsg });
        throw err;
      });

    // See https://github.com/openai/openai-node/issues/232#issuecomment-2022934871
    const response = await new Promise(resolve => {
      stream.then(async str => {
        let response = "";
        var length = this.conversation.push({ role: 'assistant', content: response });
        for await (const part of str) {
          console.info("Part: " + JSON.stringify(part));
          var chunk = part.choices[0]?.delta?.content || '';
          console.info("Chunk: '" + chunk + "'");
          response += chunk;
          this.conversation[length - 1] = { role: 'assistant', content: response };
        }
        console.info("Last event received, complete response: " + response);
        resolve(response);
      }).catch(error => {
        console.error("An error occurred during OpenAI request: " + error);
        resolve(error.message || `An error occurred during OpenAI request: ` + error);
      });
    });

    console.info("Return complete response: " + response);
    return response;
  }

  /**
   * Send conversation starter
   * @param id Suggestion Id, e.g. 0
   */
  sendSuggestion(event: Event, id: string): void {
    //alert("Send suggestion '" + id + "' ...");
    //alert("Send suggestion '" + event.type + "' ...");

    var chosenSuggestion = { type: 'starter', index: id };

    this.sendRequestToLLM(this.conversation, chosenSuggestion);
  }

  /**
   * Send user message
   */
  sendMessage(event: Event, message: string): void {
    event.preventDefault();
    if (!message.trim()) return;

    this.conversation.push({ role: 'user', content: message });
    this.userMessage = '';

    var chosenSuggestion = null;

    this.sendRequestToLLM(this.conversation, chosenSuggestion);
  }

  /**
   * Send message to agent / LLM
   */
  sendRequestToLLM(messages: Array<Message>, chosenSuggestion: {type: string; index: string} | null) {
    console.info("HomeComponent#sendRequestToLLM(): Send message to agent / LLM ...");
    if (environment.useSSE) {
      console.info("HomeComponent#sendRequestToLLM(): Use Server-Sent Events ...");
      this.stream(messages, chosenSuggestion).then(response => {
          console.info("HomeComponent#sendRequestToLLM(): Complete Response: " + response);
          // INFO: Push when complete response received
          //this.conversation.push({ role: 'assistant', content: response });
        });
    } else {
      this.responseReceived = false;
      if (chosenSuggestion != null) {
        console.info("HomeComponent#sendRequestToLLM(): User has chosen a suggestion, therefore start a new conversation.");
        this.conversation_id = null;
      }
      this.chatGptService
        .chat(this.conversation_id, messages, chosenSuggestion) // Send message to LLM
        .pipe(
          take(1),
          tap(response => {
            console.info("HomeComponent#sendRequestToLLM(): Parse LLM response ...");
            if (response.choices.length < 1) {
              console.error("HomeComponent#sendRequestToLLM(): No choices received!");
            }
            this.responseReceived = true;
            if (response.conversation_id) {
              this.conversation_id = response.conversation_id;
              console.info("HomeComponent#sendRequestToLLM(): Conversation Id: " + this.conversation_id);
            }
            for (var choice of response.choices) {
              const _message = choice.message.content;
              const _role = choice.message.role;
              if (_role == "assistant") {
                this.conversation.push({ role: 'assistant', content: _message });
              } else if (_role == "user") {
                this.conversation.push({ role: 'user', content: _message });
              } else if (_role == "system") {
                this.conversation.push({ role: 'system', content: _message });
              } else if (_role == "error") {
                this.conversation.push({ role: 'error', content: _message });
                console.error("Error message received from server: " + _message);
              } else {
                this.conversation.push({ role: 'error', content: "No such role '" + _role + "' supported!" });
              }
            }
            this.scrollToBottom();
          }),
          catchError((error: HttpErrorResponse): Observable<any> => {
            // See https://angular.io/api/common/http/HttpErrorResponse
            console.error("Error status: " + error.status);
            console.error("Error message: " + error.message);
            this.responseReceived = true;
            if (error.status == 401 || error.status == 403) {
              console.warn("Authorization failed for " + error.url + ". User must be signed in (and member of a Katie domain) or that API token is valid.");
              this.conversation.push({ role: 'error', content: 'Error occured: ' + error.message });
              //this.conversation.push({ role: 'error', content: 'Please make sure to be <a href=\"/#/login\">signed in</a> (and member of a Katie domain) or <a href="/#/register">sign up</a> for free :-)' });
              //this.conversation.push({ role: 'error', content: 'Authorization failed for ' + error.url + '. Please make sure to be <a href=\"/#/login\">signed in</a>, or that your API token is correct.' });
            } else {
              this.conversation.push({ role: 'error', content: 'Http Error status: ' + error.status + ' - ' + error.url });
            }
            return of(null);
          })
          //catchError((error) => this.handleError(error))
        )
        .subscribe();
    }
  }

  /**
   *
   */
  handleEnterKey(event: Event): void {
    event.preventDefault();
    this.sendMessage(event, this.userMessage);
    this.scrollToBottom();
  }

  /**
   * Scroll to bottom of chat container
   */
  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  /**
   * Handle OpenAI API error
   * @param error OpenAI API error (message, type, param, code), see https://platform.openai.com/docs/guides/error-codes/api-errors
   */
  private handleError(error: ErrorResponse): Observable<unknown> {
    if (error.error && error.error.message) {
      let errorMessage = `Error: ${error.error.message}`;
      if (error.error.type) {
        errorMessage += ` (Type: ${error.error.type})`;
      }
      this.conversation.push({ role: 'error', content: errorMessage });
    } else {
      console.error("An unknown error occurred!");
      this.conversation.push({ role: 'error', content: 'An unknown error occurred.' });
    }
    this.scrollToBottom();
    return of(null);
  }
}
