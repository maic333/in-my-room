import { Observable, Observer, throwError } from 'rxjs';
import { ChatEvent, ChatEventType } from '../types/chat-event';
import { v4 as uuid } from 'uuid';
import { map } from 'rxjs/operators';

export class ChatClient {
  // Websocket server URL
  private serverUrl: string;
  // Websocket client
  private ws: WebSocket;
  // request to observer map (by transaction ID)
  private requestObserverMap = new Map<string, Observer<ChatEvent>>();

  constructor(url: string) {
    this.serverUrl = url;
  }

  connect(): Observable<undefined> {
    return new Observable((observer) => {
      // create socket for given room
      this.ws = new WebSocket(this.serverUrl);

      // wait for messages from the server
      this.ws.onmessage = (event: MessageEvent) => {
        this.handleServerMessage(event.data);
      };

      this.ws.onopen = () => {
        observer.next();
        observer.complete();
      };

      this.ws.onerror = () => {
        // #TODO handle connection error
        // #TODO handle message error aswell !?
      };
    });
  }

  /**
   * Authenticate to the chat server
   */
  authenticate(token: string): Observable<boolean> {
    return this.sendRequest(ChatEventType.CLIENT_AUTH_REQUEST, {token})
      .pipe(
        map((event: ChatEvent) => {
          if (event.type === ChatEventType.CLIENT_AUTH_SUCCESS) {
            return true;
          }

          return false;
        })
      );
  }

  /**
   * Handle a server message received through the Websocket channel
   */
  private handleServerMessage(message: string): void {
    try {
      const event: ChatEvent = JSON.parse(message);

      // find the observer for the transaction ID
      const observer = this.requestObserverMap.get(event.transactionId);
      if (observer) {
        // emit the message and complete the observer
        observer.next(event);
        observer.complete();
      } else {
        // drop unexpected message
      }
    } catch (err) {
      // drop wrongly formatted messages
    }
  }

  /**
   * Send a formatted request to the server
   */
  private sendRequest(eventType: ChatEventType, body: any): Observable<ChatEvent> {
    return new Observable((observer: Observer<ChatEvent>) => {
      // generate unique transaction ID for request
      const transactionId = uuid();

      // map the request to an observer by transaction ID
      // so we can complete the observable when receiving the corresponding response
      this.requestObserverMap.set(transactionId, observer);

      // create the request payload
      const req: ChatEvent = {
        type: eventType,
        body: body,
        transactionId: transactionId
      };

      // send the request
      this.ws.send(JSON.stringify(req));

      // the observer will be completed when receiving the response (inside the 'handleServerMessage' method)
    });
  }
}
