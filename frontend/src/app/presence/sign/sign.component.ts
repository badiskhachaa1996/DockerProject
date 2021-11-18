import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Presence } from 'src/app/models/Presence';
import jwt_decode from 'jwt-decode';
import { PresenceService } from 'src/app/services/presence.service';
import { FileUpload } from 'primeng/fileupload';
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor(private PresenceService: PresenceService, private route: ActivatedRoute,private AuthService:AuthService) { }

  token;
  justif_file_value;
  justif_file_name;
  showJustif;
  loadingFile = false;
  uploadFile = false;
  presences;
  userList=[];
  ID = (this.route.snapshot.paramMap.get('id')) ? this.route.snapshot.paramMap.get('id') : "6193cff7cfe12a30f41859ed";

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
  reloadPresence(){
    this.PresenceService.getAllBySeance(this.ID).subscribe(data => {
      console.log(data)
      this.presences = data;

    }, error => console.log(error))
  }
  ngOnInit(): void {
    this.ID = (this.route.snapshot.paramMap.get('id')) ? this.route.snapshot.paramMap.get('id') : "6193cff7cfe12a30f41859ed";
    this.token = jwt_decode(localStorage.getItem("token"))
    this.reloadPresence();
    this.AuthService.getAll().subscribe((data)=>{
      data.forEach(user => {
        this.userList[user._id]=user;
      });
    })
      /*const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      if(data.fileType.includes("Error")){
        console.log(data.fileType)
      }
      let blob: Blob = new Blob([byteArray], { type: data.fileType})
      let reader: FileReader = new FileReader();
      reader.addEventListener("load", () => {
        this.showJustif = reader.result;
      }, false);
      if (blob) {
        this.showJustif = "../assets/images/avatar.PNG"
        reader.readAsDataURL(blob);
      }*/

  }

  getSignature() {
    var canvasContents = this.myCanvas.nativeElement.toDataURL();
    var data = { a: canvasContents };
    var string = JSON.stringify(data);
    var signature = string.substring(6, string.length - 2);
    var sign = signature.substring(signature.indexOf(",") + 1)
    console.log(sign)
    let presence = new Presence(null, "617bbf3f2ad5353fe4f44fd4", this.token.id, true, sign)
    this.PresenceService.create(presence).subscribe((data) => {
      console.log(data)
    }, err => {
      console.error(err)
    })
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.files && event.files.length > 0) {
      this.uploadFile = true
      let file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.justif_file_value = reader.result.toString().split(',')[1];
        this.justif_file_name = file.name;
        this.uploadFile = false;
      };
    }
    this.fileInput.clear()
  }

  sendJustif() {
    this.uploadFile = true
    this.PresenceService.addJustificatif({ justificatif: this.justif_file_value, name: this.justif_file_name, _id: this.ID }).subscribe((data) => {
      this.uploadFile = false;
    }, error => console.log(error))
  }
  downloadFile(rowData) {
    this.PresenceService.getJustificatif(rowData._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.fileType }), data.fileName)
    }, (error) => {
      console.error(error)
    })
  }
  acceptJustif(rowData) {
    this.PresenceService.isPresent(rowData._id).subscribe((data) => {
      this.reloadPresence();
    }, (error) => {
      console.error(error)
    })
  }
}
