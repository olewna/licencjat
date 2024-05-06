import { Component, ContentChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() text!: string;
  @Input() responseModal: boolean = false;
  @ContentChild('modalDiv') modalDiv!: ElementRef;
}
