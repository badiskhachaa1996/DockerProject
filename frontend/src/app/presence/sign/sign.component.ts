import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Presence } from 'src/app/models/Presence';
import jwt_decode from 'jwt-decode';
import { PresenceService } from 'src/app/services/presence.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor(private PresenceService:PresenceService) { }

  token;

  @ViewChild("mon_canvas") myCanvas: ElementRef;
  @ViewChild('justificatif') fileInput: FileUpload;
  loading: boolean = false;
  ngAfterViewInit(): void {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    var context = this.myCanvas.nativeElement.getContext('2d');
    this.myCanvas.nativeElement.addEventListener('mousedown', e => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    this.myCanvas.nativeElement.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });

    function drawLine(context, x1, y1, x2, y2) {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }
  }
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
  }

  getSignature(){
    var canvasContents = this.myCanvas.nativeElement.toDataURL();
    var data = { a: canvasContents };
    var string = JSON.stringify(data);
    var signature = string.substring(6, string.length - 2);
    var sign = signature.substring(signature.indexOf(",")+1)
    console.log(sign)
    let presence = new Presence(null,"617bbf3f2ad5353fe4f44fd4",this.token.id,true,sign)
    this.PresenceService.create(presence).subscribe((data)=>{
      console.log(data)
    },err=>{
      console.error(err)
    })
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.files && event.files.length > 0) {
      this.loading = true
      let file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        /*this.commentForm.get('file').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        })
        this.commentForm.get('value').setValue(reader.result.toString().split(',')[1])
        */this.loading = false;
      };
    }
    this.fileInput.clear()
  }

}
