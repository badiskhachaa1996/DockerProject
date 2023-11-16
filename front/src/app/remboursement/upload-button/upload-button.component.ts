import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {

  @Output() uploadFile = new EventEmitter<any>();

  @Input() isDisable = false

  constructor() { }

  ngOnInit(): void {
  }
  
  onUpload(event) {
    this.uploadFile.emit(event)
  }
}
