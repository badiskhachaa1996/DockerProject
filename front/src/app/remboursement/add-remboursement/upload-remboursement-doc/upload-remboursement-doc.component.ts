import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-upload-remboursement-doc',
  templateUrl: './upload-remboursement-doc.component.html',
  styleUrls: ['./upload-remboursement-doc.component.scss']
})
export class UploadRemboursementDocComponent implements OnInit {

  @Input() document

  @Input() user

  @Output() uploadDoc = new EventEmitter<any>();

  @Output() removeDoc = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  onUpload(event: any) {
    this.document.doc = event.target.files[0];
    this.document.added_on = new Date()
    this.document.added_by = this.user
    this.document.doc_number = this.document.slug[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()
    this.uploadDoc.emit(this.document)
  }

  reset(doc) {
    doc.value = ""
    this.removeDoc.emit(this.document.slug)
  }

}
