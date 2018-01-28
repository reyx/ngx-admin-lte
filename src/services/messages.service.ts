// based on https://github.com/ng-book/angular2-rxjs-chat/blob/master/app/ts/services/MessagesService.ts
import { User } from '../models/user';
import { Message } from '../models/message';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

declare var $: any;

const initialMessages: Message[] = [];

type IMessagesOperation = (messages: Message[]) => Message[];

@Injectable()
export class MessagesService {
  private messagesList: Message[] = [];
  // a stream that publishes new messages only once
  public newMessages: Subject<Message> = new Subject<Message>();

  // `messages` is a stream that emits an array of the most up to date messages
  public messages: ReplaySubject<Message[]> = new ReplaySubject<Message[]>(1);

  // `updates` receives _operations_ to be applied to our `messages`
  // it's a way we can perform changes on *all* messages (that are currently
  // stored in `messages`)
  public updates: Subject<any> = new Subject<any>();

  // action streams
  public create: Subject<Message> = new Subject<Message>();
  // public markThreadAsRead: Subject<any> = new Subject<any>();

  constructor() {
    // recois des operation, et les fais sur la liste interne, puis diffuse le resultat sur messages
    this.updates.subscribe(ope => {
      this.messagesList = ope(this.messagesList);
      this.messages.next(this.messagesList);
    });

    this.newMessages
      .map(function(message: Message): IMessagesOperation {
        return (messages: Message[]) => {
          return messages.concat(message);
        };
      })
      .subscribe(this.updates);
  }

  // an imperative function call to this action stream
  public addMessage(message: Message): void {
    this.newMessages.next(message);
  }

  public alert(
    content: string,
    title: string = 'Atenção',
    type: string = 'red'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      $.confirm({
        title,
        content,
        type,
        icon: 'fa fa-warning',
        buttons: {
          ok: { text: 'Ok', btnClass: `btn-${type}` },
        },
      });
    });
  }

  public confirm(title: string, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      $.confirm({
        title,
        content,
        buttons: {
          yes: {
            text: 'Sim',
            btnClass: 'btn-blue',
            keys: ['enter', 'shift'],
            action: () => resolve(true),
          },
          no: {
            text: 'Não',
            action: () => reject(),
          },
        },
      });
    });
  }

  public select(
    title: string,
    content: string,
    values: [{ value: string; text: string }]
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = values.map(item => {
        return `
        <option value="${item.value}" class="name form-control" required>
          ${item.text}
        </option>`;
      });

      $.confirm({
        title,
        content: `
        <p>${content}</p>
        <form action="" id="confirm-dialog">
          <div class="form-group">
            <select autofocus id="prompt-value" class="form-control" required>
              ${options}
            </select>
          </div>
        </form>`,
        buttons: {
          submit: {
            text: 'Confirmar',
            btnClass: 'btn-blue',
            action: () => resolve($('#prompt-value').val()),
          },
          cancel: {
            text: 'Cancelar',
            action: () => reject(),
          },
        },
        onContentReady: function() {
          const jc = this;
          this.$content.find('form').on('submit', e => {
            e.preventDefault();
            jc.$$submit.trigger('click');
          });
        },
      });
    });
  }

  public prompt(title: string, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      $.confirm({
        title,
        content: `
        <p>${content}</p>
        <form action="" id="prompt-dialog">
          <div class="form-group">
            <input autofocus id="prompt-value" class="form-control" name="value" required />
          </div>
        </form>`,
        buttons: {
          submit: {
            text: 'Confirmar',
            btnClass: 'btn-blue',
            action: () => {
              resolve($('#prompt-value').val());
            },
          },
          cancel: {
            text: 'Cancelar',
          },
        },
        onContentReady: function() {
          const jc = this;
          this.$content.find('form').on('submit', e => {
            e.preventDefault();
            jc.$$submit.trigger('click');
          });
        },
      });
    });
  }
}
