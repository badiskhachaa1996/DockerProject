import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Presence } from 'src/app/models/Presence';
import jwt_decode from 'jwt-decode';
import { PresenceService } from 'src/app/services/presence.service';
import { FileUpload } from 'primeng/fileupload';
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/socket.service';
const io = require("socket.io-client");

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor(private PresenceService: PresenceService, private route: ActivatedRoute,private AuthService:AuthService,private MessageService:MessageService, private SocketService:SocketService) { }
  socket = io(environment.origin.replace('/soc',''));
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
    if(this.token.role=='user' || this.token.role=='Formateur'){
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
    this.socket.on("refreshPresences", () => {
      this.reloadPresence();
    })
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
      this.MessageService.add({ severity: 'success', summary: 'Signature', detail: 'Vous êtes compté comme présent avec signature' })
      this.SocketService.addPresence();
      console.log(data)
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: err })
      console.error(err)
    })
  }

  getPDF(){
    this.PresenceService.getPDF(this.ID).subscribe((data)=>{
      if(data){
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        importedSaveAs(new Blob([byteArray], { type: 'application/pdf' }), this.ID+".pdf")
      }
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
      this.MessageService.add({ severity: 'success', summary: 'Justification', detail: "Votre justification a été enregistré" })
    }, error => console.log(error))
  }
  downloadFile(rowData) {
    this.PresenceService.getJustificatif(rowData._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.fileType }), data.fileName)
    }, (error) => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: rowData._id })
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
