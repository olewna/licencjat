import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as LR from '@uploadcare/blocks';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
})
export class FoodFormComponent implements OnInit, OnDestroy {
  protected owner: boolean = false;
  protected url: string = '';

  uploadedFiles: LR.OutputFileEntry<'success'>[] = [];
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<LR.UploadCtxProvider>
  >;

  ngOnInit() {
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleChangeEvent
    );

    this.ctxProviderRef.nativeElement.addEventListener(
      'modal-close',
      this.handleModalCloseEvent
    );
  }

  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener(
      'change',
      this.handleChangeEvent
    );

    this.ctxProviderRef.nativeElement.removeEventListener(
      'modal-close',
      this.handleModalCloseEvent
    );
  }

  resetUploaderState() {
    this.ctxProviderRef.nativeElement.uploadCollection.clearAll();
  }

  handleModalCloseEvent = () => {
    this.resetUploaderState();
    this.uploadedFiles = [];
    this.url = '';
  };

  handleChangeEvent = (e: LR.EventMap['change']) => {
    this.uploadedFiles = e.detail.allEntries.filter(
      (f) => f.status === 'success'
    ) as LR.OutputFileEntry<'success'>[];
    if (this.uploadedFiles.length > 0) {
      this.url = this.uploadedFiles[0].cdnUrl;
    }
  };
}
