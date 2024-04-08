import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as LR from '@uploadcare/blocks';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @Output() url = new EventEmitter<string>();
  protected imageUrl: string = '';

  protected uploadedFiles: LR.OutputFileEntry<'success'>[] = [];
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<LR.UploadCtxProvider>
  >;

  public ngOnInit(): void {
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleChangeEvent
    );

    this.ctxProviderRef.nativeElement.addEventListener(
      'modal-close',
      this.handleModalCloseEvent
    );
  }

  public ngOnDestroy(): void {
    this.ctxProviderRef.nativeElement.removeEventListener(
      'change',
      this.handleChangeEvent
    );

    this.ctxProviderRef.nativeElement.removeEventListener(
      'modal-close',
      this.handleModalCloseEvent
    );
  }

  public resetUploaderState(): void {
    this.ctxProviderRef.nativeElement.uploadCollection.clearAll();
  }

  public handleModalCloseEvent = (): void => {
    this.resetUploaderState();
    this.uploadedFiles = [];
    this.url.emit('');
    this.imageUrl = '';
  };

  public handleChangeEvent = (e: LR.EventMap['change']): void => {
    this.uploadedFiles = e.detail.allEntries.filter(
      (f) => f.status === 'success'
    ) as LR.OutputFileEntry<'success'>[];
    if (this.uploadedFiles.length > 0) {
      this.url.emit(this.uploadedFiles[0].cdnUrl);
      this.imageUrl = '';
    }
  };
}
