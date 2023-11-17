import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {

  @Output() uploadFile = new EventEmitter<any>();

  @Input() isDisable = false
  @Input() doc_number

  @Output() downloadDoc =  new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log("Doc Numher")
    console.log(this.doc_number)
  }
  
  onUpload(event) {
    this.uploadFile.emit(event)
  }

  downloadDocument(event) {
    this.downloadDoc.emit(event)
  }
}
