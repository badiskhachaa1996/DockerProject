import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Presence } from 'src/app/models/Presence';
import jwt_decode from 'jwt-decode';
import { PresenceService } from 'src/app/services/presence.service';
import { FileUpload } from 'primeng/fileupload';
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  userList = [];
  presences;
  allPresences;
  reader: FileReader = new FileReader();
  ID = (this.route.snapshot.paramMap.get('id')) ? this.route.snapshot.paramMap.get('id') : "6193cff7cfe12a30f41859ed";

  constructor(private PresenceService: PresenceService, private route: ActivatedRoute, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.ID = (this.route.snapshot.paramMap.get('id')) ? this.route.snapshot.paramMap.get('id') : "6193cff7cfe12a30f41859ed";
    this.AuthService.getAll().subscribe((data) => {
      data.forEach(user => {
        this.userList[user._id] = user;
      });
    })

    this.reader.addEventListener("load", () => {
      //console.log(this.reader.result);
    }, false);

    this.PresenceService.getAllBySeance(this.ID).subscribe(data => {
      this.presences = data;
    }, error => console.log(error))

    this.PresenceService.getAllSignatureBySeance(this.ID).subscribe(data => {
      console.log(data)
      this.allPresences = data;
      /*data.forEach(element => {
        const byteArray = new Uint8Array(atob(element.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: 'image/png' })
        if (blob) {
          this.reader.readAsDataURL(blob);
        }
      });*/
    }, error => console.log(error))
  }
  test(){
    console.log("REREqsd")
    return '../assets/layout/images/pages/avatar.png'
  }
}
