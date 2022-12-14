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
import { SignaturePad } from 'angular2-signaturepad';

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
  presences: Presence[];
  userList = [];
  allowJustificatif = false
  classeList = [{}];
  campusDic = {}
  diplomeList = {};
  showCanvas = true;
  presence: any = null;
  ID = this.route.snapshot.paramMap.get('id');
  seance: Seance;
  showFiles: [{ name: string, right: string, upload_by: string }];
  date = new Date().getTime()
  date_debut; date_fin;
  formateurInfo: Formateur = null;
  dropdownEtudiant = []
  groupeFilter: [{ label: string, value: string }];

  @ViewChild('justificatif') fileInput: FileUpload;
  loading: boolean = false;
  affichageDiplome = ""
  affichageGroupe = ""

  formAddEtudiant = this.formBuilder.group({
    etudiant_id: [null]
  });

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': parseInt(this.mobilecheck().replace('px', '')),
    'canvasHeight': 300
  };

  mobilecheck() {
    var check = false;

    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    if (check)
      return (window.innerWidth - 92).toString() + 'px';
    else return '500px'
  };

  tableauPresence = []

  reloadPresence() {
    //this.seance.classe_id
    this.PresenceService.getAllPopulateBySeance(this.ID).subscribe(data => {
      this.presences = data;
      let oldPresence = []
      this.tableauPresence = []
      this.etudiantService.getAllByMultipleClasseID(this.seance.classe_id).subscribe(etudiants => {
        this.presences.forEach(p => {
          let bypass: any = p.user_id
          if (bypass) {
            oldPresence.push(bypass._id)
            this.tableauPresence.push({
              etudiant: bypass?.firstname + ' ' + bypass?.lastname,
              _id: p._id,
              isPresent: p.isPresent,
              Sign: p.signature,
              justificatif: p.justificatif,
              date_signature: p.date_signature,
              user_id: bypass._id,
              isFormateur: bypass?.type == "Formateur"
            })
          }
        })
        etudiants.forEach(etu => {
          if (etu.user_id)
            if (this.customIndexOf(oldPresence, etu.user_id._id) == -1)
              this.tableauPresence.push({
                etudiant: etu.user_id?.firstname + ' ' + etu.user_id?.lastname,
                _id: etu._id + "NEW",
                isPresent: false,
                Sign: false,
                justificatif: false,
                date_signature: null,
                user_id: etu.user_id?._id,
                isFormateur: etu.user_id?.type == "Formateur"
              })
        })
      })
      data.forEach(element => {
        if (element.user_id._id == this.token.id) {
          this.presence = element
        }
      });
      this.showCanvas = this.showCanvas && this.presence == null
    }, error => console.error(error))
  }

  ngAfterViewInit() {
    /*
    Not Working because .set('canvasWidth') est mal fait dans la lib
    if (this.mobilecheck) {
      console.log(window.innerWidth - 32)
      this.signaturePad.set('canvasWidth', window.innerWidth - 32);
      this.signaturePadOptions['canvasWidth'] = window.innerWidth - 32
    }*/
  }


  ngOnInit(): void {

    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.FormateurService.getByUserId(this.token.id).subscribe(data => {
      this.formateurInfo = data
    })
    this.AuthService.getAll().subscribe((dataU) => {
      dataU.forEach(user => {
        this.userList[user._id] = user;
      });
    })
    this.ClasseService.getAll().subscribe(dataU => {
      dataU.forEach(classe => {
        this.classeList[classe._id] = classe;
      });
      // this.ClasseService.getAll().subscribe( dataU => {
      //   dataU.forEach(item => {
      //     this.groupeFilter.push(item.label, item.value);
      //   })})
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
      this.seance = dataS
      this.showFiles = null
      if (dataS.fileRight != null && dataS.fileRight.length != 0)
        this.seance.fileRight.forEach(f => {
          if (f.right != 'false')
            if (this.showFiles != null)
              this.showFiles.push(f)
            else
              this.showFiles = [f]
        })
      this.date_debut = new Date(dataS.date_debut).getTime()
      this.date_fin = this.date_debut + (30 * 60000)
      if (this.token.id == dataS.formateur_id)
        this.date_fin = new Date(dataS.date_fin).getTime()
      this.allowJustificatif = this.date < new Date(dataS.date_fin).getTime() + ((60 * 24 * 3) * 60000)
      this.showCanvas = this.showCanvas && this.date > this.date_debut && this.date_fin > this.date
      this.DiplomeService.getAll().subscribe(diplomes => {
        diplomes.forEach(diplome => {
          this.diplomeList[diplome._id] = diplome
        })
        if (this.seance) {
          this.reloadPresence();
          this.seance.classe_id.forEach((cid, index) => {
            if (this.classeList[cid] && this.diplomeList[this.classeList[cid].diplome_id] && this.diplomeList[this.classeList[cid].diplome_id].titre) {
              if (index == 0) {
                this.affichageDiplome = this.diplomeList[this.classeList[cid].diplome_id].titre
              } else if (this.affichageDiplome.includes(this.diplomeList[this.classeList[cid].diplome_id].titre) == false) {
                this.affichageDiplome = this.affichageDiplome + ", " + this.diplomeList[this.classeList[cid].diplome_id].titre
              }
            }
            if (this.classeList[cid] && this.classeList[cid].abbrv) {
              if (index == 0) {
                this.affichageGroupe = this.classeList[cid].abbrv
              } else if (this.affichageGroupe.includes(this.classeList[cid].abbrv) == false) {
                this.affichageGroupe = this.affichageGroupe + ", " + this.classeList[cid].abbrv
              }
            }
          })
        }
      })
    })

    this.socket.on("refreshPresences", () => {
      this.reloadPresence();
    })
  }

  loadDropdownEtudiant() {
    this.etudiantService.getAllByMultipleClasseIDWithoutPresence(this.seance.classe_id, this.presences).subscribe(d => {
      this.dropdownEtudiant = []
      d.forEach(etud => {
        let user: any = etud.user_id
        let classe: any = etud.classe_id
        let temp = {
          label: user.lastname + " " + user.firstname + " - " + classe.abbrv,
          value: user._id
        }
        if (!this.customIncludes(this.dropdownEtudiant, temp)) {
          this.dropdownEtudiant.push(temp)
        }
      })
      this.formAddEtudiant.patchValue({ etudiant_id: this.dropdownEtudiant[0] })
    })
  }

  getSignature() {
    var canvasContents = this.signaturePad.toDataURL();
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
            /*this.FormateurService.updateMatiere(data, this.seance).subscribe(dataVH => {
              this.MessageService.add({ severity: 'success', summary: 'Volume Horaire', detail: "Votre volume horaire réalisé a bien été mis à jour" })
            })*/
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
            /*this.FormateurService.updateMatiere(data, this.seance).subscribe(dataVH => {
              this.MessageService.add({ severity: 'success', summary: 'Volume Horaire', detail: "Votre volume horaire réalisé a bien été mis à jour" })
            })*/
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
      if ((date_seance.getMinutes() + 30) > date_seance.getMinutes()) {
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
        if (res.data) {
          this.seance = res.data
          this.showFiles = null
          if (res.data.fileRight != null && res.data.fileRight.length != 0)
            this.seance.fileRight.forEach(f => {
              if (f.right != 'false')
                if (this.showFiles != null)
                  this.showFiles.push(f)
                else
                  this.showFiles = [f]
            })
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
        this.showFiles = null
        if (data.data.fileRight != null && data.data.fileRight.length != 0)
          this.seance.fileRight.forEach(f => {
            if (f.right != 'false')
              if (this.showFiles != null)
                this.showFiles.push(f)
              else
                this.showFiles = [f]
          })
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
      //TODO
      this.reloadPresence()
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
  clonedRowData = this.tableauPresence
  onRowEditInit(rowData) {
    this.clonedRowData[rowData._id] = { ...rowData };
  }

  onRowEditSave(rowData, index: number) {
    let presence = new Presence(
      rowData._id,
      this.seance._id,
      rowData.user_id,
      rowData.isPresent,
      rowData.Sign,
      rowData.justificatif,
      rowData.date_signature,
      rowData.isPresent
    )
    if (rowData._id.includes('NEW')) {
      delete presence._id
      this.PresenceService.create(presence).subscribe(data => {
        rowData._id = data._id
        this.tableauPresence[index] = rowData
        this.MessageService.add({ severity: "success", summary: "L'étudiant peut signer" })
      }, error => {
        this.MessageService.add({ severity: "error", summary: "Erreur contacté un Admin", detail: error })
      })
    } else if (rowData.isPresent == false) {
      this.PresenceService.isPresent(presence._id, false).subscribe(data => {
        this.MessageService.add({ severity: "success", summary: "L'étudiant a été noté absent" })
      }, error => {
        this.MessageService.add({ severity: "error", summary: "Erreur contacté un Admin", detail: error })
      })
    } else if (rowData.isPresent == true) {
      this.PresenceService.isPresent(presence._id, true).subscribe(data => {
        this.MessageService.add({ severity: "success", summary: "L'étudiant a été noté présent", detail: "Il peut maintenant signer sa présence" })
      }, error => {
        this.MessageService.add({ severity: "error", summary: "Erreur contacté un Admin", detail: error })
      })
    }

  }

  onRowEditCancel(rowData, index: number) {
    this.tableauPresence[index] = this.clonedRowData[rowData._id];
    delete this.clonedRowData[rowData._id];
  }

  customIndexOf(array: string[], id: string) {
    let idx = -1
    array.forEach((ele, index) => {
      if (ele == id)
        idx = index
    })
    return idx
  }


}


