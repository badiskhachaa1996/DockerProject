import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Matching } from 'src/app/models/Matching';
@Component({
  selector: 'app-new-cvtheque-interne',
  templateUrl: './new-cvtheque-interne.component.html',
  styleUrls: ['./new-cvtheque-interne.component.scss']
})
export class NewCvthequeInterneComponent implements OnInit {
  nationList = environment.nationalites;
  paysList = environment.pays;
  civiliteList = environment.civilite;

  cvs: any[] = []
  dicPicture = {}
  dicMatching = {}
  constructor(private AuthService: AuthService, private CVService: CvService, private MatchingService: MatchingService, private router: Router,
    private ToastService: MessageService) { }

  ngOnInit(): void {
    this.CVService.getCvs().then(cvs => {
      this.cvs = cvs
    })
    this.CVService.getAllPicture().subscribe(data => {
      this.dicPicture = data.files // {id:{ file: string, extension: string }}
      data.ids.forEach(id => {
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.dicPicture[id].url = reader.result;
        }
      })
    })
    this.MatchingService.getAll().subscribe(matchings => {
      matchings.forEach(m => {
        if (m.cv_id)
          if (this.dicMatching[m.cv_id._id])
            this.dicMatching[m.cv_id._id] = this.dicMatching[m.cv_id._id] + 1
          else
            this.dicMatching[m.cv_id._id] = 1
      })
    })
  }

  disponible(d: Date) {
    return new Date(d).getTime() <= new Date().getTime()
  }

  onFilterInput() {

  }

  deleteCV(cv: CV) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      this.CVService.deleteCV(cv._id).then(r => {
        //TODO IF TYPE GNGNGN SUPPRIMER LEXTERNE
      })
    }
  }

  goToCV(cv: CV) {
    localStorage.setItem('seeEditBTNCV', 'true')
    this.router.navigate(['imatch/cv', cv._id])
  }
  downloadOldCV(cv: CV) {
    this.CVService.downloadCV(cv.user_id._id).then(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }
  cvToUpdate;
  formUpdate = new FormGroup({
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    nationnalite: new FormControl(''),
    email_perso: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    pays_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl(''),
    _id: new FormControl('', Validators.required),
    last_modified_at: new FormControl(new Date())
  })

  cvToAdd;
  formAdd = new FormGroup({
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    nationnalite: new FormControl(''),
    email_perso: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    pays_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl('')
  })
  onInitUpdate(cv: CV) {
    this.formUpdate.patchValue({ ...cv.user_id })
    this.cvToUpdate = cv
    this.scrollToTop()
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  saveUpdate() {
    this.AuthService.update({ ...this.formUpdate.value }).subscribe(r => {
      this.formUpdate.reset()
      this.cvToUpdate = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour réussi' })
    })
  }
  saveAdd() {
    this.AuthService.create({ ...this.formAdd.value }).subscribe(user => {
      this.CVService.postCv({ user_id: user._id }).then(cv => {
        this.ToastService.add({ severity: 'success', summary: 'Création du cv avec succès.' })
        this.formAdd.reset()
        this.cvToAdd = false
        this.cvs.push(cv)
      })
    })

  }

  onLoadMatching(user_id) {
    this.MatchingService.getAllByCVUSERID(user_id).subscribe(matchings => {
      this.matchingToSee = matchings
    })
  }

  matchingToSee: Matching[] = []

}
