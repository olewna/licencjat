import { Component, ContentChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() text!: string;
  @ContentChild('modalDiv') modalDiv!: ElementRef;
}
