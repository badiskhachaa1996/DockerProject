import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Presence } from 'src/app/models/Presence';
import jwt_decode from 'jwt-decode';
import { PresenceService } from 'src/app/services/presence.service';
import { FileUpload } from 'primeng/fileupload';
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/socket.service';
import { SeanceService } from 'src/app/services/seance.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { ClasseService } from 'src/app/services/classe.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Seance } from 'src/app/models/Seance';
const io = require("socket.io-client");

@Component({
  selector: 'app-emergement',
  templateUrl: './emergement.component.html',
  styleUrls: ['./emergement.component.scss']
})
export class EmergementComponent implements OnInit {

  matiereList = {};

  constructor(private MatiereService: MatiereService, private ClasseService: ClasseService, private PresenceService: PresenceService, private router: Router, private FormateurService: FormateurService, private route: ActivatedRoute,
    private AuthService: AuthService, private MessageService: MessageService, private SocketService: SocketService, private SeanceService: SeanceService, private DiplomeService: DiplomeService) { }
  socket = io(environment.origin.replace('/soc', ''));
  token;
  justif_file_value;
  justif_file_name;
  showJustif;
  loadingFile = false;
  uploadFile = false;
  presences;
  userList = [];
  classeList = [{}];
  diplomeList = {};
  dataRole = { data: "", type: "" };
  showCanvas = true;
  presence = null;
  ID = this.route.snapshot.paramMap.get('id');
  seance: Seance;
  date = new Date().getTime()
  date_debut; date_fin;

  @ViewChild("canva") myCanvas: ElementRef;
  @ViewChild('justificatif') fileInput: FileUpload;
  loading: boolean = false;
  affichageDiplome = ""

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
      this.showCanvas = false
    });

    window.addEventListener('mouseup', e => {
      /*if (e.origin !== environment.origin) // Compliant
          return;*/
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });

    function drawLine(ctxt, x1, y1, x2, y2) {
      ctxt.beginPath();
      ctxt.strokeStyle = 'black';
      ctxt.lineWidth = 1;
      ctxt.moveTo(x1, y1);
      ctxt.lineTo(x2, y2);
      ctxt.stroke();
      ctxt.closePath();
    }
  }

  reloadPresence() {
    this.PresenceService.getAllBySeance(this.ID).subscribe(data => {
      this.presences = data;
      data.forEach(element => {
        if (element.user_id == this.token.id) {
          this.presence = element
        }
      });
    }, error => console.error(error))
  }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    }
    this.reloadPresence();
    this.AuthService.WhatTheRole(this.token.id).subscribe(data => {
      this.dataRole = data
    })
    this.AuthService.getAll().subscribe((dataU) => {
      dataU.forEach(user => {
        this.userList[user._id] = user;
      });
    })
    this.ClasseService.getAll().subscribe((dataU) => {
      dataU.forEach(classe => {
        this.classeList[classe._id] = classe;
      });
    })
    this.MatiereService.getAll().subscribe((dataU) => {
      dataU.forEach(mat => {
        this.matiereList[mat._id] = mat;
      });
    })
    this.SeanceService.getById(this.ID).subscribe(dataS => {
      this.seance = dataS
      this.date_debut = new Date(dataS.date_debut).getTime()
      this.date_fin = new Date(dataS.date_fin).getTime()
    })
    this.DiplomeService.getAll().subscribe(diplomes => {
      diplomes.forEach(diplome => {
        this.diplomeList[diplome._id] = diplome
      })
      if (this.seance) {
        this.seance.classe_id.forEach((cid, index) => {
          if (this.diplomeList[this.classeList[cid].diplome_id] && this.diplomeList[this.classeList[cid].diplome_id].titre) {
            if (index == 0) {
              this.affichageDiplome = this.diplomeList[this.classeList[cid].diplome_id].titre
            } else if (this.affichageDiplome.includes(this.diplomeList[this.classeList[cid].diplome_id].titre) == false) {
              this.affichageDiplome = this.affichageDiplome + ", " + this.diplomeList[this.classeList[cid].diplome_id].titre
            }
          }
        })
      }
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
    let presence = new Presence(null, this.ID, this.token.id, true, sign)

    this.PresenceService.create(presence).subscribe((data) => {
      this.MessageService.add({ severity: 'success', summary: 'Signature', detail: 'Vous êtes compté comme présent avec signature' })
      this.AuthService.WhatTheRole(this.token.id).subscribe(dataWTR => {
        if (dataWTR.type == "Formateur") {
          this.FormateurService.updateMatiere(dataWTR.data, this.seance).subscribe(dataVH => {
            this.MessageService.add({ severity: 'success', summary: 'Volume Horaire', detail: "Votre volume horaire réalisé a bien été mis à jour" })
          })
        }
      })
      this.SocketService.addPresence();
      this.reloadPresence()
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: err })
      console.error(err)
    })
  }

  getPDF() {
    this.PresenceService.getPDF(this.ID).subscribe((data) => {
      if (data) {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        importedSaveAs(new Blob([byteArray], { type: 'application/pdf' }), this.ID + ".pdf")
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
    this.PresenceService.addJustificatif({ justificatif: this.justif_file_value, name: this.justif_file_name, user_id: this.token.id, seance_id: this.ID }).subscribe((data) => {
      this.uploadFile = false;
      this.MessageService.add({ severity: 'success', summary: 'Justification', detail: "Votre justification a été enregistré" })
    }, error => console.error(error))
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
  colorDate(rowData: Presence) {
    let date_seance: Date = new Date(this.seance.date_debut)
    let date_sign: Date = new Date(rowData.date_signature)
    if(date_seance.getHours()==date_sign.getHours()){
      if((date_seance.getMinutes()+15)>date_seance.getMinutes()){
        return "color:black;"
      }
    }
    return "color:red;"
  }
}
