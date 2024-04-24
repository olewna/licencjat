import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ChatMessage } from 'src/app/shared/models/ChatMessage.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  public constructor(private authService: AuthService) {}
  @Input() public gamename!: string;
  protected joined: boolean = false;
  protected socket!: Socket;
  protected chatMessages: ChatMessage[] = [];
  protected message: string = '';

  public ngOnInit(): void {
    console.log(this.authService.getUser());
    this.socket = io('http://localhost:4000');

    this.socket.on('newMsg', (data) => {
      this.chatMessages.push(JSON.parse(data));
    });
  }

  public ngOnDestroy(): void {
    this.socket.disconnect();
  }

  public sendMessage() {
    const msg: ChatMessage = {
      author: this.authService.getUser(),
      message: this.message,
      room: this.gamename,
    };
    this.message = '';
    this.chatMessages.push(msg);
    this.socket.emit('msg', JSON.stringify(msg));
  }

  public joinChat(): void {
    this.socket.emit('join', this.gamename);
    this.joined = true;
  }
  public leaveChat(): void {
    this.joined = false;
  }
}
