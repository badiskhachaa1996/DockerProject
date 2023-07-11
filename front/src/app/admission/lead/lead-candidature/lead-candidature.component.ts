import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { CandidatureLead } from 'src/app/models/CandidatureLead';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { CandidatureLeadService } from 'src/app/services/candidature-lead.service';

@Component({
  selector: 'app-lead-candidature',
  templateUrl: './lead-candidature.component.html',
  styleUrls: ['./lead-candidature.component.scss']
})
export class LeadCandidatureComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute, private LeadService: AdmissionService, private CandidatureService: CandidatureLeadService) { }
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
  formCandidature = new FormGroup({
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
  ngOnInit(): void {
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

  }
  saveCandidature() {
    var canvasContents = this.signaturePad.toDataURL();
    var data = { a: canvasContents };
    var string = JSON.stringify(data);
    var signature = string.substring(6, string.length - 2);
    var sign = signature.substring(signature.indexOf(",") + 1)
    this.CandidatureService.getByLead(this.ID).subscribe(c => {
      if (c) {
        this.CandidatureService.update({ ...this.formCandidature.value, date_creation: new Date() }).subscribe(newCandidature => {
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
