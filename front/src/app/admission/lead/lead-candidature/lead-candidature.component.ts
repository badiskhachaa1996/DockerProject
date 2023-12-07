import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { CandidatureLead } from 'src/app/models/CandidatureLead';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { CandidatureLeadService } from 'src/app/services/candidature-lead.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-lead-candidature',
  templateUrl: './lead-candidature.component.html',
  styleUrls: ['./lead-candidature.component.scss']
})
export class LeadCandidatureComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  @Input() PROSPECTID
  constructor(private route: ActivatedRoute, private LeadService: AdmissionService, private CandidatureService: CandidatureLeadService, private ToastService: MessageService) { }
  pageNumber = 1
  PROSPECT: Prospect
  candidature: CandidatureLead
  boolSelect = [
    { label: "Oui", value: true },
    { label: "Non", value: false }
  ]
  niveauSelect = [
    { label: "Débutant(e)", value: "Débutant(e)" },
    { label: "Intermédiaire", value: "Intermédiaire" },
    { label: "Confirmé(e)", value: "Confirmé(e)" },
  ]
  ratingSelect = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]
  formCandidature = new UntypedFormGroup({
    nom: new FormControl(''),
    prenom: new FormControl(''),
    date_naissance: new FormControl(''),
    nationalite: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    adresse: new FormControl(''),
    lead_id: new FormControl(''),
    isPMR: new FormControl(false),
    PMRneedHelp: new FormControl(false),
    qualites: new FormControl(''),
    toWorkOn: new FormControl(''),
    skills: new FormControl(''),
    parcours: new FormControl(''),
    experiences: new FormControl(''),
    courtterme3: new FormControl(''),
    courtterme5: new FormControl(''),
    courtterme10: new FormControl(''),
    formation: new FormControl(''),
    campus: new FormControl(''),
    rentrée_scolaire: new FormControl(''),
    niveau: new FormControl("Intermédiaire"),
    suivicours: new FormControl(false),
    acceptRythme: new FormControl(false),
    besoins: new FormControl(''),
    motivations: new FormControl(2),
    attentes: new FormControl(''),
    niveau_actuel: new FormControl(2),
    competences_digitales: new FormControl(2),
    competences_teams: new FormControl(2),
    competences_solo: new FormControl(2),
  })
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
  signature: any = "../assets/images/avatar.PNG";
  reader: FileReader = new FileReader();
  ngOnInit(): void {
    if (!this.ID)
      this.ID = this.PROSPECTID
    this.LeadService.getPopulate(this.ID).subscribe(p => {
      this.PROSPECT = p
      this.CandidatureService.getByLead(this.ID).subscribe(c => {
        if (c) {
          this.candidature = c
          this.pageNumber = 0
        } else {
          this.initCandidature()
        }
      })
    })
    this.reader.addEventListener("load", () => {
      this.signature = this.reader.result;
      let html = `


      <!doctype html>
      <html>
      <head>
      <title>IEG | Dossier de candidature</title>
      <meta name="description" content="Dossier de candidature pour IntedGroup">
      <style>
      body {
        background: rgb(204,204,204); 
        font-family: 'DM Serif Text', serif;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
      }
      page {
        background: white;
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5cm;
        box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
      }
      page[size="A4"] {  
        width: 21cm;
        height: 32cm; 
      }
      
      .page-container {
        height: 100%;
        width: 100%;
      }
      
      h3 {
        color: #0a2f41;
      }
      .container {
        padding: 10mm 20mm;
      }
      
      .header {
        display: flex;
        align-items: center;
      }
      
      .logo img {
        width: 150px;
        display: inline-block;
      }
      
      .header .title {
        border-left: 0.5mm solid #0a2f41;
        padding: 3mm 5mm;
        margin-left: 5mm;
        display: inline-block;
      }
      
      .header .title h1 {
        color: #444444;
        font-weight: 700;
        margin-top: 0;
        font-size: 28px;
        margin-bottom: 0;
      }
      
      .header .title h2 {
        color: #444444;
        margin: 0;
        font-size: 16px;
      }
      
      .coord-candidat {
        margin-top: 50px;
      }
      .coord-candidat h2 {
        color: white;
        background-color: #0a2f41;
        text-align: center;
        border-radius: 1mm;
        padding: 5px 0;
        font-size: 14px;
        width: 100%;
      }
      
      
      .coord-candidat .content-coord {
        border: 0.5mm solid #0a2f41;
        border-radius: 1mm;
        padding: 5mm;
        margin-bottom: 10mm;
      }
      
      .lign-coord {
        width: 100%;
      }
      
      .title-coord {
        display: inline-block;
        color: #0a2f41;
        width: 60%;
      }
      
      
      .response-coord {
        display: inline-block;
        width: 30%;
      }
      
      p {
        margin-top: 0;
      }
      .last {
        margin: 0;
      }
      
      .title-coord {
        font-weight: bold;
      }
      
      .footer-page {
        position: relative;
       bottom: -30px;
      }
      .footer-page p {
        font-size: 10px;
        color: #777777;
        margin: 0;
        font-weight: 500;
        text-align: center;
      }
      
      section h3 {
        margin-top: 30px;
      }
      
      
      .section-title {
        background-color: #eaeaea;
        border: 1px solid #0a2f41;
        border-radius: 10px;
        color: #0a2f41;
        padding: 20px 0;
        font-weight: 600;
        font-size: 20px;
        text-align: center;
      }
      
      .section-answer {
        border: 1px solid #444444;
        border-radius: 1mm;
        padding: 2mm;
        min-height: 100px;
      }
      
      .response-short {
        font-weight: 400;
        color: black;
      }
      
      
      
      @media print {
        body, page {
          margin: 0;
          box-shadow: 0;
        }
      }
      </style>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
      </head>
      <body>
          <page size="A4">
              <div class="page-container">
              <div class="container">
                  <div class="header">
                      <div class="logo"><img src="assets/images/logo_ieg.png"></div>
                      <div class="title">
                          <h1>DOSSIER DE CANDIDATURE</h1>
                          <h2>Année Universitaire : <span id="annee-universitaire">2023 / 2024</span></h2>
                          <h2>Date du dépot de dossier : <span id="date-depot">${this.candidature.date_creation}</span></h2>
                      </div>
                  </div>
                  <div class="coord-candidat">
                      <h2>COORDONNÉES DU CANDIDAT</h2>
                      <div class="content-coord">
                          <div class="lign-coord">
                              <p class="title-coord">Numéro dossier :</p>
                              <p class="response-coord" id="file-number">Dossier N°${this.PROSPECT.customid}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Nom :</p>
                              <p class="response-coord" id="student-last-name">${this.candidature.nom}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Prénom :</p>
                              <p class="response-coord" id="student-first-name">${this.candidature.prenom}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Date de Naissance :</p>
                              <p class="response-coord" id="student-birth-date">${this.candidature.date_naissance}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Nationalité :</p>
                              <p class="response-coord" id="student-nationality">${this.candidature.nationalite}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Téléphone :</p>
                              <p class="response-coord" id="student-number">${this.candidature.phone}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">E-mail :</p>
                              <p class="response-coord" id="student-email">${this.candidature.email}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord">Êtes-vous en situation de handicap ?</p>
                              <p class="response-coord" id="student-handicap">${this.candidature.isPMR ? 'Oui' : 'Non'}</p>
                          </div>
                          <div class="lign-coord">
                              <p class="title-coord last">Avez-vous besoin d'un accompagnement
                                  spécifique dans le cadre de votre handicap :</p>
                              <p class="response-coord last" id="student-need-accom">${this.candidature.PMRneedHelp ? 'Oui' : 'Non'}</p>
                          </div>
                      </div>
                  </div>
                  <div class="list">
                      <h3 class="title">Déroulement de la candidature :</h3>
                      <p>Le candidat doit :</p>
                      <ul>
                          <li>Compléter son projet professionnel</li>
                          <li>Compléter ses attentes</li>
                          <li>Compléter le test de positionnement</li>
                          <li>Effectuer un test de niveau correspondant à la formation souhaitée</li>
                          <li>Participer à un entretien préalable à la formation</li>
                          <li>Attendre la décision du Conseil d'Orientation qui lui sera communiquée par mail ou par téléphone</li>
                      </ul>
                  </div>
                  <div class="list">
                      <h3 class="title">Décisions possibles à l'issue du Conseil d'Orientation :</h3>
                      <ul>
                          <li>Admission dans la formation choisie</li>
                          <li>Admission sous réserve d'obtention de diplôme ou d'un complément de formation</li>
                          <li>Réorientation</li>
                          <li>Refus</li>
                      </ul>
                  </div>
                  <div class="list">
                      <h3 class="title">Liste des justificatifs à fournir :</h3>
                      <ul>
                          <li>Copie couleur de la pièce d'identité valide (Passeport + Visa, titre de séjour, Carte d'identité)</li>
                          <li>Copie des relevés de notes et des diplômes (bac + post bac) des deux dernières années</li>
                          <li>CV actualisé</li>
                      </ul>
                  </div>
                  <div class="list">
                      <h3 class="title">N.B :</h3>
                      <ul>
                          <li>Attestation de comparabilité de diplôme étranger</li>
                          <li>pour le dernier diplôme obtenu) exigée le jour de l'inscription définitive sur le campus.</li>
                          <li>=> Information et démarches sur : <br>http://france-education-international.fr/hub/reconnaissance-de-diplomes</li>
                      </ul>
                  </div>

              </div>

          </div>

          </page>
          <page size="A4">
              <div class="page-container">
              <div class="container">
                  <section>
                      <div class="section-title">PROJET PROFESSIONNEL</div>
                      <h3 class="section-question">1 - Mes qualités :</h3>
                      <div class="section-answer">${this.candidature.qualites}</div>
                      <h3 class="section-question">2 - Mes points à améliorer :</h3>
                      <div class="section-answer">${this.candidature.toWorkOn}</div>
                      <h3 class="section-question">3- Mes compétences (mon savoir-faire):</h3>
                      <div class="section-answer">${this.candidature.skills}</div>
                      <h3 class="section-question">4 - Mon parcours d'études</h3>
                      <div class="section-answer">${this.candidature.parcours}</div>
                      <h3 class="section-question">5- Mes expériences professionnelles (stages, jobs, …) :</h3>
                      <div class="section-answer">${this.candidature.experiences}</div>
                  </section>
              </div>
              <div class="footer-page">
                  <p>Groupe IEG</p>
                  <p>CFA ESPIC / ADG / STUDINFO / INT</p>
                  <p>Campus Paris 15 Rue Louvre 75001 Paris | Campus Montpellier 1 Place Charles de Gaulle 34170 Castelnau Le Lez - Campus Marnes :</p>
              </div>
          </div>

          </page>

          <page size="A4">
              <div class="page-container">
                  <div class="container">
                      <section>


                          <h3 class="section-question">Ma vision professionnelle à court terme :</h3>
                          <div class="section-answer">${this.candidature.courtterme3}</div>
                          <h3 class="section-question">Ma vision professionnelle moyen-terme (5 ans) :</h3>
                          <div class="section-answer">${this.candidature.courtterme5}</div>
                          <h3 class="section-question">Ma vision professionnelle a long-terme (10 ans) </h3>
                          <div class="section-answer">${this.candidature.courtterme10}</div>
                      </br>
                  </br>
              </br>
          </br>
      </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
                      </section>
                  </div>

                  <div class="footer-page missing">
                      <p>Groupe IEG</p>
                      <p>CFA ESPIC / ADG / STUDINFO / INT</p>
                      <p>Campus Paris 15 Rue Louvre 75001 Paris | Campus Montpellier 1 Place Charles de Gaulle 34170 Castelnau Le Lez - Campus Marnes :</p>
                  </div>
             </div>
          </page>


          <page size="A4">
              <div class="page-container">
                  <div class="container">
                      <div class="section-title">LES ATTENTES DU CANDIDAT</div>

                      <section>
                          <h3 class="section-question"> Formation souhaitée : </h3>
                          <div class="section-answer">${this.candidature.formation}</div>
                          <h3 class="section-question">Campus choisi : </h3>
                          <div class="section-answer">${this.candidature.campus}</div>
                          <h3 class="section-question">Concernant votre niveau actuel, au regard de la formation souhaitée, diriez-vous que vous êtes :</h3>
                          <div class="section-answer">${this.candidature.niveau}</div>

                      </section>

                  </div>
              </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
                  <div class="footer-page missing">
                      <p>Groupe IEG</p>
                      <p>CFA ESPIC / ADG / STUDINFO / INT</p>
                      <p>Campus Paris 15 Rue Louvre 75001 Paris | Campus Montpellier 1 Place Charles de Gaulle 34170 Castelnau Le Lez - Campus Marnes :</p>
                  </div>
             </div>
          </page>
          <page size="A4">
              <div class="page-container">
                  <div class="container">


                      <section>

                          <h3 class="section-question">Avez-vous déjà suivi des cours de matières professionnalisantes ? </h3>
                          <div class="section-answer">${this.candidature.suivicours ? 'Oui' : 'Non'}</div>
                          <h3 class="section-question">Nos formations se déroulent en rythme alterné, ce format vous paraît-il adapté à vos attentes ? </h3>
                          <div class="section-answer">${this.candidature.acceptRythme ? 'Oui' : 'Non'}</div>
                          <h3 class="section-question">En fonction de votre situation personnelle, avez-vous des besoins ou des souhaits liés à l'accès à nos formations ? (Par exemple : handicap, matériel spécifique etc.…) </h3>
                          <div class="section-answer">${this.candidature.besoins}</div>
                      </section>
                  </div>
              </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
                  <div class="footer-page missing">
                      <p>Groupe IEG</p>
                      <p>CFA ESPIC / ADG / STUDINFO / INT</p>
                      <p>Campus Paris 15 Rue Louvre 75001 Paris | Campus Montpellier 1 Place Charles de Gaulle 34170 Castelnau Le Lez - Campus Marnes :</p>
                  </div>
             </div>
          </page>
          <div class="page-container">
          <div class="container">
              <div class="section-title">TEST DE POSITIONNEMENT</div>

                <section>
                    <h3 class="section-question">1. Quel est votre degré de motivation en arrivant en formation ?  <span class="response-short"> ${this.candidature.motivations}/5</span></h3>
                    <h3 class="section-question">2. Qu'attendez - vous de la formation ? </h3>
                    <div class="section-answer">${this.candidature.attentes}</div>
                    <h3 class="section-question">3. Concernant votre niveau actuel dans le domaine de la formation souhaitée ?  <span class="response-short"> ${this.candidature.niveau_actuel}/5</span></h3>
                    <h3 class="section-question">4. Concernant vos compétences digitales ?  <span class="response-short"> ${this.candidature.competences_digitales}/5</span></h3>
                    <h3 class="section-question">5. Concernant votre capacité à travailler en équipe ?  <span class="response-short"> ${this.candidature.competences_teams}/5</span></h3>
                    <h3 class="section-question">6. Concernant votre capacité à travailler en autonomie ?  <span class="response-short"> ${this.candidature.competences_solo}/5</span></h3>


                </section>
              </div>
            <h3>&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Signature </h3>
            &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<img style="max-width: 200px;max-height: 200px;" src="${this.signature}">
          </div>
          </div>
      </body>
      </html>
          `
      var opt = {
        margin: 0,
        filename: 'candidature.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: [21, 32], orientation: 'portrait' }
      };
      let doc = html2pdf().set(opt).from(html, 'string').save()
    }, false);

  }
  convertDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  initCandidature() {
    if (this.candidature) {
      this.formCandidature.patchValue({ ...this.candidature, date_naissance: this.convertDate(this.candidature.date_naissance) })
    } else {
      let user: User = this.PROSPECT.user_id
      this.formCandidature.patchValue({
        nom: user.lastname,
        prenom: user.firstname,
        email: user.email_perso,
        nationalite: user.nationnalite,
        phone: user.indicatif + " " + user.phone,
        date_naissance: this.convertDate(this.PROSPECT.date_naissance),//TODO
        formation: this.PROSPECT.formation,
        campus: this.PROSPECT.campus_choix_1,
        rentree_scolaire: this.PROSPECT.rentree_scolaire,
        isPMR: false,
        PMRneedHelp: false,
        niveau: "Intermédiaire",
        suivicours: false,
        acceptRythme: false,
        motivations: 2,
        niveau_actuel: 2,
        competences_digitales: 2,
        competences_teams: 2,
        competences_solo: 2,
      })
    }
    this.pageNumber = 1
  }
  downloadCandidature() {
    this.CandidatureService.downloadSignature(this.candidature._id).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      let blob: Blob = new Blob([byteArray], { type: data.documentType })
      if (blob) {
        this.reader.readAsDataURL(blob);
      } else {
        this.ToastService.add({ severity: 'error', summary: 'Un problème a eu lieu avec la signature' })
        console.error(blob)
      }
    })

  }
  saveCandidature(signatureMode = false) {
    if (signatureMode) {
      var canvasContents = this.signaturePad.toDataURL();
      var data = { a: canvasContents };
      var string = JSON.stringify(data);
      var signature = string.substring(6, string.length - 2);
      var sign = signature.substring(signature.indexOf(",") + 1)
    }

    this.CandidatureService.getByLead(this.ID).subscribe(c => {
      if (c) {
        this.CandidatureService.update({ ...this.formCandidature.value, date_creation: new Date(), _id: c._id }).subscribe(newCandidature => {
          this.candidature = newCandidature
          this.pageNumber = 0
        })
      } else {
        this.CandidatureService.create({ ...this.formCandidature.value, date_creation: new Date(), signature: sign, lead_id: this.PROSPECT._id }).subscribe(newCandidature => {
          this.candidature = newCandidature
          this.pageNumber = 0
        })
      }
    })
  }

}
