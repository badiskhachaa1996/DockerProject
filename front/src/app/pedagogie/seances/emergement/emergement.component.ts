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
import { FormBuilder, Validators } from '@angular/forms';
import { Formateur } from 'src/app/models/Formateur';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { CampusService } from 'src/app/services/campus.service';
const io = require("socket.io-client");

@Component({
  selector: 'app-emergement',
  templateUrl: './emergement.component.html',
  styleUrls: ['./emergement.component.scss'],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class EmergementComponent implements OnInit {

  matiereList = {};

  constructor(private MatiereService: MatiereService, private ClasseService: ClasseService, private PresenceService: PresenceService, private router: Router, private FormateurService: FormateurService, private route: ActivatedRoute,
    private AuthService: AuthService, private MessageService: MessageService, private SocketService: SocketService, private SeanceService: SeanceService,
    private DiplomeService: DiplomeService, private formBuilder: FormBuilder, private etudiantService: EtudiantService, private CampusService: CampusService) { }
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
  campusDic = {}
  diplomeList = {};
  showCanvas = true;
  presence: any = null;
  ID = this.route.snapshot.paramMap.get('id');
  seance: Seance;
  date = new Date().getTime()
  date_debut; date_fin;
  formateurInfo: Formateur = null;
  dropdownEtudiant = []
  groupeFilter: [{ label: string, value: string }];

  @ViewChild("canva") myCanvas: ElementRef;
  @ViewChild('justificatif') fileInput: FileUpload;
  loading: boolean = false;
  affichageDiplome = ""

  formAddEtudiant = this.formBuilder.group({
    etudiant_id: [null]
  });

  clearCanvas() {
    var context = this.myCanvas.nativeElement.getContext('2d');
    context.clearRect(0, 0, 500, 500)
  }

  ngAfterViewInit(): void {
    let isDrawing = false;
    let x = 0;//-15
    let y = 0;//-20
    let canvas = this.myCanvas.nativeElement
    var context = canvas.getContext('2d');
    let scrollX = window.scrollX || document.documentElement.scrollLeft;
    let scrollY = window.scrollY || document.documentElement.scrollTop;

    //Base PC Canvas 
    canvas.addEventListener('mousedown', e => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (e.target !== canvas) // Compliant
        return;
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });

    function drawLine(ctxt, x1, y1, x2, y2) {
      x1 -= 15
      y1 -= 20
      x2 -= 15
      y2 -= 20
      ctxt.beginPath();
      ctxt.strokeStyle = 'black';
      ctxt.lineWidth = 1;
      ctxt.moveTo(x1, y1);
      ctxt.lineTo(x2, y2);
      ctxt.stroke();
      ctxt.closePath();
    }

    //Base Mobile Canvas
    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
      };
    }

    canvas.addEventListener("touchstart", function (e) {
      window.scrollTo(scrollX, scrollY);
      let t = getTouchPos(this, e);
      x = t.x
      y = t.y
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.dispatchEvent(mouseEvent);
    }, { passive: false });

    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      this.dispatchEvent(mouseEvent);
    }, { passive: false });

    canvas.addEventListener("touchmove", function (e) {
      window.scrollTo(scrollX, scrollY);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.dispatchEvent(mouseEvent);
    }, { passive: false });
  }



  reloadPresence() {
    this.PresenceService.getAllBySeance(this.ID).subscribe(data => {
      this.presences = data;
      data.forEach(element => {
        if (element.user_id == this.token.id) {
          this.presence = element
        }
      });
      this.showCanvas = this.showCanvas && this.presence == null
    }, error => console.error(error))
  }


  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.reloadPresence();
    this.FormateurService.getByUserId(this.token.id).subscribe(data => {
      this.formateurInfo = data
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
      this.CampusService.getAll().subscribe(dataC => {
        let dicCampus = {}
        let dicDiplome = {}
        dataC.forEach(c => {
          dicCampus[c._id] = c
        })
        this.DiplomeService.getAll().subscribe(dataD => {
          dataD.forEach(d => {
            dicDiplome[d._id] = d
          })
          dataU.forEach(c => {
            this.campusDic[c._id] = dicCampus[dicDiplome[c.diplome_id]?.campus_id]?.libelle
          })
        })

      })
    })
    this.MatiereService.getAll().subscribe((dataU) => {
      dataU.forEach(mat => {
        this.matiereList[mat._id] = mat;
      });
    })
    this.SeanceService.getById(this.ID).subscribe(dataS => {
      console.log(dataS)
      this.seance = dataS
      this.date_debut = new Date(dataS.date_debut).getTime()
      this.date_fin = this.date_debut + (15 * 60)//15 minutes max
      this.showCanvas = this.showCanvas && this.date > this.date_debut && this.date_fin > this.date
      this.etudiantService.getAllByMultipleClasseID(this.seance.classe_id).subscribe(data => {
        console.log(data)
        data.forEach(etu => {
          if (etu.user_id != null && etu.classe_id != null) {
            let temp = {
              label: etu.user_id.lastname + " " + etu.user_id.firstname + " - " + etu.classe_id.nom,
              value: etu.user_id._id
            }
            if (!this.customIncludes(this.dropdownEtudiant, temp)) {
              this.dropdownEtudiant.push(temp)
            }
          }
        })
        this.formAddEtudiant.patchValue({ etudiant_id: this.dropdownEtudiant[0] })
      })
    })
    this.DiplomeService.getAll().subscribe(diplomes => {
      diplomes.forEach(diplome => {
        this.diplomeList[diplome._id] = diplome
      })
      if (this.seance) {
        this.seance.classe_id.forEach((cid, index) => {
          if (this.classeList[cid] && this.diplomeList[this.classeList[cid].diplome_id] && this.diplomeList[this.classeList[cid].diplome_id].titre) {
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
    if (!this.presence) {
      this.PresenceService.create(presence).subscribe((data) => {
        this.MessageService.add({ severity: 'success', summary: 'Signature', detail: 'Vous êtes compté comme présent avec signature' })
        this.FormateurService.getByUserId(this.token.id).subscribe(data => {
          if (data) {
            this.FormateurService.updateMatiere(data, this.seance).subscribe(dataVH => {
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
    } else {
      presence._id = this.presence._id
      this.PresenceService.addSignature(presence).subscribe(data => {
        this.MessageService.add({ severity: 'success', summary: 'Signature', detail: 'Vous êtes compté comme présent avec signature' })
        this.FormateurService.getByUserId(this.token.id).subscribe(data => {
          if (data) {
            this.FormateurService.updateMatiere(data, this.seance).subscribe(dataVH => {
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


  }

  showPdf = false

  getPDF(classe_id) {
    this.PresenceService.getPDF(this.ID, classe_id).subscribe((data) => {
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
      this.reloadPresence()
      this.MessageService.add({ severity: 'success', summary: 'Justification', detail: "Votre justification a été enregistré" })
    }, error => console.error(error))

  }

  downloadFile(rowData) {
    this.PresenceService.getJustificatif(rowData._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.fileType }), data.fileName)
    }, (error) => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: rowData._id })
      console.error(error)
    })
  }

  acceptJustif(rowData, bool) {
    this.PresenceService.isPresent(rowData._id, bool).subscribe((data) => {
      this.reloadPresence();
    }, (error) => {
      console.error(error)
    })
  }
  colorDate(rowData: Presence) {
    let date_seance: Date = new Date(this.seance.date_debut)
    let date_sign: Date = new Date(rowData.date_signature)
    if (date_seance.getHours() == date_sign.getHours()) {
      if ((date_seance.getMinutes() + 15) > date_seance.getMinutes()) {
        return "color:black;"
      }
    }
    return "color:red;"
  }
  showUploadFile = false

  formUploadFile = this.formBuilder.group({
    etat: [null]
  });
  FileUpload(event) {
    if (event.files != null) {
      if (this.formUploadFile.value.etat == null) {
        this.formUploadFile.patchValue(
          { etat: confirm("Voulez-vous que le fichier sois visible par les étudiants ?") }
        )
      }
      this.MessageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.ID)
      formData.append('etat', this.formUploadFile.value.etat)
      formData.append('user', this.token.id)
      formData.append('file', event.files[0])
      this.SeanceService.uploadFile(formData, this.ID).subscribe(res => {
        this.MessageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        event.target = null;
        console.log(res)
        if (res.data) {
          this.seance = res.data
        }
        this.showUploadFile = false;
      }, error => {
        this.MessageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  downloadFileCours(file) {
    this.SeanceService.downloadFileCours(file.name, this.ID).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.fileType }), file.name)
    }, (error) => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: error })
      console.error(error)
    })
  }

  deleteFile(file) {
    this.SeanceService.deleteFile(file.name, this.ID).subscribe(data => {
      if (data.data) {
        this.seance = data.data
      }
    }, (error) => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: error })
      console.error(error)
    })
  }

  showAddEtudiant = false

  addEtudiant() {
    let id = this.formAddEtudiant.value.etudiant_id
    if (this.formAddEtudiant.value.etudiant_id?.value != null) {
      id = this.formAddEtudiant.value.etudiant_id.value
    }
    console.log(this.formAddEtudiant.value.etudiant_id, this.formAddEtudiant.value.etudiant_id?.value, id)
    this.PresenceService.create({
      _id: null,
      user_id: id,
      isPresent: false,
      signature: null,
      seance_id: this.ID,
      allowedByFormateur: true
    }).subscribe(data => {
      this.showAddEtudiant = false
      console.log(data)
      this.MessageService.add({ severity: "success", summary: "L'étudiant peut signer" })
    }, error => {
      console.error(error)
      this.MessageService.add({ severity: "error", summary: "Erreur contacté un Admin", detail: error })
    })
  }

  customIncludes(l: any, d: { label: string, value: string }) {
    let r = false
    l.forEach(e => {
      if (e.label == d.label && e.value == d.value) {
        r = true
      }
    })
    return r
  }
}
