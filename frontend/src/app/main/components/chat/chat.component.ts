import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input() public gamename!: string;
  protected joined: boolean = false;

  public joinChat(): void {
    this.joined = true;
  }
  public leaveChat(): void {
    this.joined = false;
  }
}
