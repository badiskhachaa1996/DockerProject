import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/api/product';
import { Diplome } from 'src/app/models/Diplome';
import { ProductService } from 'src/app/service/productservice';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EcoleService } from 'src/app/services/ecole.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { AuthService } from 'src/app/services/auth.service';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { Ecole } from 'src/app/models/Ecole';
import { Campus } from 'src/app/models/Campus';
import { saveAs as importedSaveAs } from "file-saver";


@Component({
  selector: 'app-list-diplome',
  templateUrl: './list-diplome.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-diplome.component.scss']
})
export class ListDiplomeComponent implements OnInit {

  products: Product[];
  isExpanded: boolean = false;
  expandedRows = {};


  rythmeList = [
    { value: "2 jours par semaine" },
    { value: "1 semaine sur 3" },
    { value: "1 jour par semaine" }
  ]

  domaineEtude = [
    { value: "Commerce" },
    { value: "RH" },
    { value: "Informatique" },
    { value: "Gestion" },
    { value: "Construction" },
    { value: "Santé, Sanitaire et Social" }
  ]

  typeDiplome = [
    { value: "BTS" },
    { value: "RNCP" }
  ]

  typeEtude = [
    { value: "Initial" },
    { value: "Apprentissage" },
    { value: "Continu" }
  ]

  niveauEtude = [
    { value: "Niveau 5" },
    { value: "Niveau 6" },
    { value: "Niveau 7" }
  ]

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ]



  
  diplomes: Diplome[] = [];

  showFormAddDiplome: boolean = false;

  formUpdateDiplome: FormGroup;
  showFormUpdateDiplome: boolean = false;
  diplomeToUpdate: Diplome = new Diplome();
  idDiplomeToUpdate: string;
  campusId: string;
  AnneeSelected: AnneeScolaire;
  EcoleSelected: Ecole;
  CampusSelected: Campus;
  ID = this.route.snapshot.paramMap.get('id');
  matiereVolume: any = {};

  dicMatiere: any
  campusList = [];
  campusListToUpdate = [];

  dicCampus = {};
  dicFormateur = {};
  dropdownFormateur = [{ "value": null, "label": "Choisissez un Formateur référent" }];
  token;
  uploadDiplome: Diplome = null

  constructor(private productService: ProductService, private route: ActivatedRoute, private campusService: CampusService, private diplomeService: DiplomeService, private router: Router, private formBuilder: FormBuilder,
    private messageService: MessageService, private matiereService: MatiereService, private ecoleService: EcoleService, private anneeScolaireService: AnneeScolaireService,
    private formateurService: FormateurService, private AuthService: AuthService) { }

  ngOnInit(): void {

    this.productService.getProductsWithOrdersSmall().then(data => this.products = data);

    this.campusId = this.route.snapshot.paramMap.get('id');
    //Recuperation de la liste des diplômes
    if (this.campusId) {
      this.diplomeService.getAllByCampus(this.campusId).subscribe(
        (data) => { this.diplomes = data; },
        (error) => { console.error(error) }
      );
    } else
      this.diplomeService.getAll().subscribe(
        (data) => { this.diplomes = data; },
        (error) => { console.error(error) }
      );
    this.campusService.getAll().subscribe(
      (data) => {
        this.campusList = data
        data.forEach(d => {
          this.dicCampus[d._id] = d
        });
      }
    )
    this.matiereService.getVolume().subscribe(data => {
      this.matiereVolume = data
    })
    this.formateurService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dicFormateur[d._id] = d
      })
      this.AuthService.getAll().subscribe(dataU => {
        let dicUser = []
        data.forEach(d => {
          dicUser.push(d.user_id)
        })
        dataU.forEach(u => {
          if (dicUser.includes(u._id)) {
            this.dropdownFormateur.push({ "label": u.lastname + " " + u.firstname, "value": u._id })
          }

        })
      })
    })

    this.matiereService.getDicMatiere().subscribe(data => {
      this.dicMatiere = data
    })


    //Initialisation du formulaire de modification de diplome
    this.onInitFormUpdateDiplome();
    if (this.ID) {
      this.campusService.getByID(this.ID).subscribe(data0 => {
        this.CampusSelected = data0[0]
        this.ecoleService.getByID(this.CampusSelected.ecole_id).subscribe((data) => {
          let idanneeselected = data.dataEcole.annee_id;
          this.EcoleSelected = data.dataEcole;
          this.anneeScolaireService.getByID(idanneeselected).subscribe((data2) => {
            this.AnneeSelected = data2.dataAnneeScolaire;
          })
        })
      })
    }
  
  }


  //Methode de recuperation du diplome à mettre à jour
  onGetbyId(diplome) {
    //Recuperation du diplome à modifier
    this.diplomeToUpdate = diplome;
    this.formUpdateDiplome.patchValue({ campus_id: this.dicCampus[diplome.campus_id] })
    if (diplome.formateur_id && diplome.formateur_id != null) {
      this.dropdownFormateur.forEach(f => {
        if (f.value == diplome.formateur_id) {
          this.formUpdateDiplome.patchValue({ formateur_id: f })
        }
      })
    } else {
      this.formUpdateDiplome.patchValue({ formateur_id: null })
    }

    this.formUpdateDiplome.patchValue({
      titre: this.diplomeToUpdate.titre, titre_long: this.diplomeToUpdate.titre_long, description: this.diplomeToUpdate.description,
      type_diplome: { value: this.diplomeToUpdate.type_diplome }, type_etude: { value: this.diplomeToUpdate.type_etude }, domaine: { value: this.diplomeToUpdate.domaine },
      niveau: { value: this.diplomeToUpdate.niveau }, certificateur: this.diplomeToUpdate.certificateur, code_RNCP: this.diplomeToUpdate.code_RNCP,
      nb_heure: this.diplomeToUpdate.nb_heure, date_debut: this.diplomeToUpdate.date_debut, date_fin: this.diplomeToUpdate.date_fin,
      rythme: { value: this.diplomeToUpdate.rythme }, frais: this.diplomeToUpdate.frais,
      frais_en_ligne: this.diplomeToUpdate.frais_en_ligne,
      isCertified: this.diplomeToUpdate.isCertified,
      date_debut_examen: this.diplomeToUpdate.date_debut_examen,
      date_fin_examen: this.diplomeToUpdate.date_fin_examen,
      date_debut_stage: this.diplomeToUpdate.date_debut_stage,
      date_fin_stage: this.diplomeToUpdate.date_fin_stage,
      code_diplome: this.diplomeToUpdate.code_diplome
    });

  }

  //Methode d'initialisation du formulaire de modification de diplome
  onInitFormUpdateDiplome() {
    this.formUpdateDiplome = this.formBuilder.group({
      titre: ['', Validators.required],
      titre_long: ['', Validators.required],
      campus_id: ['', Validators.required],
      description: ['', Validators.required],
      type_diplome: ['', Validators.required],
      type_etude: ['', Validators.required],
      domaine: ['', Validators.required],
      niveau: ['', Validators.required],
      certificateur: ['', Validators.required],
      code_RNCP: ['', Validators.required],
      nb_heure: ['', Validators.required],
      date_debut: [''],
      date_fin: [''],
      rythme: ['', Validators.required],
      frais: [''],
      frais_en_ligne: [''],
      isCertified: ['', Validators.required],
      date_debut_examen: [''],
      date_fin_examen: [''],
      date_debut_stage: [''],
      date_fin_stage: [''],
      code_diplome: ['', Validators.required],
      formateur_id: ['']
    });
  }

  //Methode d'ajout du nouveau diplome dans la base de données
  onUpdateDiplome() {
    //Mis à jour du diplome et envoi dans la base de données
    this.diplomeToUpdate.titre = this.formUpdateDiplome.get('titre')?.value;
    this.diplomeToUpdate.titre_long = this.formUpdateDiplome.get('titre_long')?.value;
    this.diplomeToUpdate.campus_id = this.formUpdateDiplome.get('campus_id')?.value._id;
    this.diplomeToUpdate.description = this.formUpdateDiplome.get('description')?.value;
    this.diplomeToUpdate.type_diplome = this.formUpdateDiplome.get('type_diplome')?.value.value;
    this.diplomeToUpdate.type_etude = this.formUpdateDiplome.get('type_etude')?.value.value;
    this.diplomeToUpdate.domaine = this.formUpdateDiplome.get('domaine')?.value.value;
    this.diplomeToUpdate.niveau = this.formUpdateDiplome.get('niveau')?.value.value;
    this.diplomeToUpdate.certificateur = this.formUpdateDiplome.get('certificateur')?.value;
    this.diplomeToUpdate.code_RNCP = this.formUpdateDiplome.get('code_RNCP')?.value;
    this.diplomeToUpdate.nb_heure = this.formUpdateDiplome.get('nb_heure')?.value;
    this.diplomeToUpdate.date_debut = this.formUpdateDiplome.get('date_debut')?.value;
    this.diplomeToUpdate.date_fin = this.formUpdateDiplome.get('date_fin')?.value;
    this.diplomeToUpdate.rythme = this.formUpdateDiplome.get('rythme')?.value.value;
    this.diplomeToUpdate.frais = this.formUpdateDiplome.get('frais')?.value;
    this.diplomeToUpdate.frais_en_ligne = this.formUpdateDiplome.get('frais_en_ligne')?.value;
    this.diplomeToUpdate.isCertified = this.formUpdateDiplome.get('isCertified')?.value.value;
    this.diplomeToUpdate.date_debut_examen = this.formUpdateDiplome.get('date_debut_examen')?.value;
    this.diplomeToUpdate.date_fin_examen = this.formUpdateDiplome.get('date_fin_examen')?.value;
    this.diplomeToUpdate.date_debut_stage = this.formUpdateDiplome.get('date_debut_stage')?.value;
    this.diplomeToUpdate.date_fin_stage = this.formUpdateDiplome.get('date_fin_stage')?.value;
    this.diplomeToUpdate.code_diplome = this.formUpdateDiplome.get('code_diplome')?.value;
    this.diplomeToUpdate.formateur_id = this.formUpdateDiplome.get('formateur_id')?.value.value;

    this.diplomeService.update(this.diplomeToUpdate).subscribe(
      ((response) => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Modification de diplôme', detail: 'Cet diplôme a bien été modifié' });
        this.diplomeService.getAll().subscribe(
          (data) => { 
            this.diplomes = data; 
            this.showFormUpdateDiplome = false;
          },
          (error) => { console.error(error) }
        );
      }),
      ((error) => { 
        console.error(error); 
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Modification de diplôme', detail: 'Impossible de modifier cet diplôme, veuillez contacter un administrateur' });
      })
    );
 
  }

  clickFile(rowData) {
    this.uploadDiplome = rowData
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    let choice = true
    if (this.uploadDiplome != null && this.uploadDiplome.imgNames.includes(event[0].name)) {
      choice = confirm("Voulez-vous remplacer le fichier " + event[0].name + " par ce fichier ?")
    }
    if (choice && event && event.length > 0 && this.uploadDiplome != null) {
      const formData = new FormData();
      formData.append('id', this.uploadDiplome._id)
      formData.append('file', event[0])
      this.diplomeService.uploadFile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de la photo de profil avec succès' });
        this.uploadDiplome = null
        if (this.campusId) {
          this.diplomeService.getAllByCampus(this.campusId).subscribe(
            (data) => { this.diplomes = data; },
            (error) => { console.error(error) }
          );
        } else
          this.diplomeService.getAll().subscribe(
            (data) => { this.diplomes = data; },
            (error) => { console.error(error) }
          );
      }, (error) => {
        console.error(error)
      })
    }
  }

  downloadFile(rowData, name) {
    this.diplomeService.getFile(rowData._id, name).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), name)
    })
  }

  

  // expandAll() {
  //   if(!this.isExpanded){
  //     this.diplomes.forEach(diplome => this.expandedRows[diplome._id] = true);

  //   } else {
  //     this.expandedRows={};
  //   }
  //   this.isExpanded = !this.isExpanded;
  // }

}