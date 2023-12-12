import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Brand } from 'src/app/models/Brand';
import { Partenaire } from 'src/app/models/Partenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { SupportMarketingService } from 'src/app/services/support-marketing.service';
import jwt_decode from "jwt-decode";
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { SupportMarketing } from 'src/app/models/SupportMarketing';
import { saveAs } from "file-saver";
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute, private SMService: SupportMarketingService, private ToastService: MessageService, private PService: PartenaireService,
    private CService: CommercialPartenaireService, private UserService: AuthService) { }

  //Partie Brands

  brands: Brand[]
  SMs: SupportMarketing[]
  isAdminPartenaire = false
  PartenaireSelected: Partenaire
  PartenaireList: { label: string, value: string }[]
  token;
  commercialPartenaire: CommercialPartenaire
  showSupportMarketing: Brand
  dicLogo = {} // {id:[{ file: string, extension: string }]}

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    if (this.ID) {
      this.PService.getById(this.ID).subscribe(data => {
        this.PartenaireSelected = data
      })
      this.CService.getByUserId(this.token.id).subscribe(commercialPartenaire => {
        this.commercialPartenaire = commercialPartenaire
        this.isAdminPartenaire = false
      })
    }
    else this.isAdminPartenaire = true;
    if (this.isAdminPartenaire) {
      this.UserService.getPopulate(this.token.id).subscribe(a => {
        a.roles_list.forEach(val => {
          if (val.module == "Partenaire")
            if (val.role == "Spectateur")
              this.isAdminPartenaire = false
        })
        if (this.token.role == "Admin")
          this.isAdminPartenaire = true
      })
    }
    this.SMService.BgetAll().subscribe(data => {
      this.brands = data
    })
    this.PService.getAll().subscribe(data => {
      this.PartenaireList = [{ label: "Tous les Partenaires", value: null, }]
      data.forEach(d => {
        this.PartenaireList.push({ label: d.nom, value: d._id })
      })
    })
    this.SMService.BgetAllLogo().subscribe(data => {
      this.dicLogo = data.files // {id:{ file: string, extension: string }}
      data.ids.forEach(id => {
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.dicLogo[id].url = reader.result;
        }
      })
      console.log(this.dicLogo)

    })
  }

  addForm = new UntypedFormGroup({
    nom: new FormControl('', Validators.required),
    description: new FormControl(),
    logo: new FormControl(''),
  })

  updateForm = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    description: new FormControl(),
    logo: new FormControl(''),
  })

  showUpdate: Brand = null
  showAdd = false



  closeSupportMarketing(showAddSM) {
    showAddSM = false;
  }
  

  initUpdate(brand: Brand) {
    this.updateForm.patchValue({ ...brand })
    this.updateForm.patchValue({ partenaire_id: brand.partenaire_id._id })
    this.showUpdate = brand
  }

  onUpdate() {
    this.SMService.Bupdate({ ...this.updateForm.value }).subscribe(data => {
      this.brands.splice(this.brands.indexOf(this.showUpdate), 1, data)
      this.updateForm.reset()
      this.showUpdate = null
      this.ToastService.add({ severity: "success", summary: "Mis à jour de la brand avec succès" })
    })
  }

  onAdd() {
    this.SMService.Bcreate({ ...this.addForm.value }).subscribe(data => {
      this.brands.push(data)
      this.addForm.reset()
      this.showAdd = false
      this.ToastService.add({ severity: "success", summary: "Ajout d'une nouvelle brand" })
    })
  }

  onDelete(brand: Brand) {
    if (confirm('Êtes-vous sûr de vouloir supprimer la brand ' + brand.nom + " ?"))
      this.SMService.Bdelete(brand._id).subscribe(data => {
        this.brands.splice(this.brands.indexOf(brand), 1)
        this.ToastService.add({ severity: "success", summary: "Brand " + data.nom + " supprimé avec succès" })
      })
  }

  onAddLogo(brand: Brand) {
    document.getElementById('selectedFile').click();
    this.logoBrand = brand
  }
  logoBrand: Brand;

  FileUploadPC(event: any) {
    if (event && event.target.files.length > 0 && this.logoBrand) {
      const formData = new FormData();
      let file: File = event.target.files[0]
      formData.append('id', this.logoBrand._id)
      formData.append('file', event.target.files[0])
      this.SMService.BuploadLogo(formData).subscribe(() => {
        this.ToastService.add({ severity: 'success', summary: 'Logo', detail: 'Mise à jour du logo avec succès' });
        this.SMService.BgetAllLogo().subscribe(data => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            if (this.dicLogo[this.logoBrand._id])
              this.dicLogo[this.logoBrand._id].url = reader.result;
            else {
              this.dicLogo[this.logoBrand._id] = {}
              this.dicLogo[this.logoBrand._id].url = reader.result;
            }
          }
        })
      }, (error) => {
        console.error(error)
      })
    }
  }

  initSupportMarketing(brand) {
    this.SMService.SMgetAllByBrand(brand._id).subscribe(sms => {
      this.SMs = sms
      this.showSupportMarketing = brand
    })
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

  //Partie Support Marketing
  showAddSM = false
  showUpdateSM: SupportMarketing
  addFormSM = new UntypedFormGroup({
    nom: new FormControl('', Validators.required),
    description: new FormControl(),
    brand_id: new FormControl(''),
    date_creation: new FormControl(new Date()),
  })
  updateFormSM = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    description: new FormControl(),
  })
  onAddSM() {
    this.addFormSM.patchValue({
      brand_id: this.showSupportMarketing._id,
      date_creation: new Date()
    })
    this.SMService.SMcreate({ ...this.addFormSM.value }).subscribe(data => {
      this.SMs.push(data)
      this.addFormSM.reset()
      this.showAddSM = false
      this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau support Marketing" })
    })
  }
  initUpdateSM(support_marketing: SupportMarketing) {
    this.updateFormSM.patchValue({ ...support_marketing })
    this.showUpdateSM = support_marketing
  }
  onUpdateSM() {
    this.SMService.SMupdate({ ...this.updateFormSM.value }).subscribe(data => {
      this.SMs.splice(this.SMs.indexOf(this.showUpdateSM), 1, data)
      this.updateFormSM.reset()
      this.showUpdateSM = null
      this.ToastService.add({ severity: "success", summary: "Mis à jour du support marketing avec succès" })
    })
  }
  onDeleteSM(support_marketing: SupportMarketing) {
    if (confirm('Êtes-vous sûr de vouloir supprimer la support marketing ' + support_marketing.nom + " ?"))
      this.SMService.SMdelete(support_marketing._id).subscribe(data => {
        this.SMs.splice(this.SMs.indexOf(support_marketing), 1)
        this.ToastService.add({ severity: "success", summary: "Support Marketing " + data.nom + " supprimé avec succès" })
      })
  }

  downloadSM(support_marketing: SupportMarketing) {
    this.SMService.SMdownload(support_marketing._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }))
    }, (error) => {
      if (error.status == 404 && error.error.message == "File not found")
        this.ToastService.add({ severity: 'error', summary: 'Pas de fichier trouvé' })
      else
        this.ToastService.add({ severity: 'error', summary: 'Contacté un Admin', detail: error })
      console.error(error)
    })
  }
  uploadSM: SupportMarketing
  onAddFile(support_marketing: SupportMarketing) {
    this.uploadSM = support_marketing
    document.getElementById('fileSM').click();
  }
  FileUploadSM(event) {
    if (event && event.target.files.length > 0 && this.uploadSM) {
      const formData = new FormData();
      formData.append('id', this.uploadSM._id)
      formData.append('file', event.target.files[0])
      this.SMService.SMupload(formData).subscribe(() => {
        this.ToastService.add({ severity: 'success', summary: 'Logo', detail: 'Mise à jour du document avec succès' });
        this.SMs[this.SMs.indexOf(this.uploadSM)].haveFile = true
      }, (error) => {
        console.error(error)
      })
    }
  }



}
