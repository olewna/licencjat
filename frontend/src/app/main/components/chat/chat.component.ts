import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ChatMessage } from 'src/app/shared/models/ChatMessage.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges {
  public constructor(private authService: AuthService) {}
  @Input() public gamename!: string;
  protected joined: boolean = false;
  protected socket!: Socket;
  protected chatMessages: ChatMessage[] = [];
  protected message: string = '';
  protected currentUser: string = this.authService.getUser();
  protected key: number = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.key !== 0) {
      this.leaveChat(changes['gamename'].previousValue);
    }
  }

  public ngOnInit(): void {
    this.socket = io('http://localhost:4000');

    this.socket.on('newMsg', (data) => {
      this.chatMessages.push(JSON.parse(data));
    });

    this.socket.on('info', (data) => {
      this.chatMessages.push(JSON.parse(data));
    });

    this.socket.on('getMsgs', (data) => {
      this.chatMessages = [...JSON.parse(data).reverse(), ...this.chatMessages];
    });
  }

  public ngOnDestroy(): void {
    this.socket.disconnect();
  }

  public sendMessage() {
    const msg: ChatMessage = {
      author: this.currentUser,
      message: this.message,
      room: this.gamename,
    };
    this.message = '';
    // this.chatMessages.push(msg);
    this.socket.emit('msg', JSON.stringify(msg));
  }

  public joinChat(): void {
    const msg: ChatMessage = {
      author: this.currentUser,
      message: 'joined!',
      room: this.gamename,
    };
    this.socket.emit('join', JSON.stringify(msg));
    this.joined = true;
  }
  public leaveChat(game?: string): void {
    if (game) {
      const msg: ChatMessage = {
        author: this.currentUser,
        message: 'left!',
        room: game,
      };
      this.socket.emit('leave', JSON.stringify(msg));
    } else {
      const msg: ChatMessage = {
        author: this.currentUser,
        message: 'left!',
        room: this.gamename,
      };
      this.socket.emit('leave', JSON.stringify(msg));
    }
    this.chatMessages = [];
    this.message = '';
    this.joined = false;
  }
}
