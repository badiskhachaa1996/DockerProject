import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwt_decode from "jwt-decode";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';
import { GenDocService } from 'src/app/services/gen_doc/gendoc.service';
import { Table } from 'primeng/table';
import { from } from 'rxjs';
import { GenSchoolService } from 'src/app/services/gen_doc/genschool.service';
import { GenCampusService } from 'src/app/services/gen_doc/gencampus.service';
import { GenSchool } from 'src/app/models/gen_doc/GenSchool';
import { GenCampus } from 'src/app/models/gen_doc/GenCampus';
import { GenFormation } from 'src/app/models/gen_doc/GenFormation';
import { GenFormationService } from 'src/app/services/gen_doc/genformation.service';
import { GenRentre } from 'src/app/models/gen_doc/GenRentre';
import { GenRentreService } from 'src/app/services/gen_doc/genrentre.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-gendoc',
  templateUrl: './gendoc.component.html',
  styleUrls: ['./gendoc.component.scss']
})
export class GendocComponent implements OnInit {

  // donner accés a la mise à jour d'un doc
  grantAccessToEdit = true

  // donner accés à la suppression
  grantAccessToDelete = true

  // le controle d'accés est hierarchique, 
  // si le user peut supprimer (delete) il peut tout faire 
  // si il peut mettre à jour (update) il peut crée et lire aussi ... 
  // il faut mettre le max qu'il peut faire

  accessControl = [
    {
      role: ["Agent"],
      accessLevel: "read"
    },
    {
      role:  [""],
      accessLevel: "create"
    },
    {
      role:  ["Responsable"],
      accessLevel: "update"
    },
    {
      role:  ["Admin"],
      accessLevel: "delete"
    },
  ]

  AccessLevel = ""




  // partie dedié aux Docs
  docList: GenDoc[] = [];
  loading: boolean = true;
  token: any;
  selectedDocs = []
  showAddDoc: boolean = false;
  formAddDoc: FormGroup;
  showUpdateDoc: GenDoc;

  schoolList: any[] = [];
  campusList: any[] = [];

  formationList: any[] = [];

  rentreList: any[] = [];

  isWoman: boolean = false;

  certificate_types = [
    {
      label: "Préinscription",
      title: "de préinscription",
      value: "pre"
    },
    {
      label: "Inscription",
      title: "d'inscription",
      value: "inscri"
    },
    {
      label: "Complémentaire",
      title: "complémentaire",
      value: "compl"
    },
    {
      label: "Paiement",
      title: "de paiement",
      value: "paiement"
    },
    {
      label: "Dérogation",
      title: "de dérogation",
      value: "derogation"
    }
  ]

  civiliteList = [
    {
      label: "Madame",
      value: "Madame"
    },
    {
      label: "Monsieur",
      value: "Monsieur"
    }
  ]

  payementList = [
    {
      label: "Espèce",
      value: "espece"
    },
    {
      label: "Virement",
      value: "virement"
    },
    {
      label: "Chèque",
      value: "cheque"
    },
  ]



  paysIsoCodes = environment.isoCodes;


  country = {
    label: "",
    value: "",
    prep: ""
  }


  id_doc: string;

  type_certif = {
    label: '',
    value: '',
    title: '', 
  };

  school: GenSchool;

  campus: GenCampus;

  formation: GenFormation;

  rentre: GenRentre;

  paiement_method: string;

  student = {
    full_name: '',
    birth_date: '',
    birth_place: '',
  };

  user: User;



  constructor(private formBuilder: FormBuilder, private UserService: AuthService,
    private messageService: MessageService, private genDocService: GenDocService, private genRentreService: GenRentreService, private genFormationService: GenFormationService, private genSchoolService: GenSchoolService,private genCampusService: GenCampusService, private router: Router) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

        //Initialisation du formulaire d'ajout d'doc
        this.formAddDoc = this.formBuilder.group({
          type_certif:  ['', Validators.required],
          school:  ['', Validators.required],
          rentre: ['', Validators.required],
          campus: ['', Validators.required],
          formation:  ['', Validators.required],
          alternance:  false,
          civilite: ['', Validators.required],
          student_full_name: ['', Validators.required],
          student_birth_date: ['', Validators.required],
          student_birth_place: ['', Validators.required],
          amount_paid: ['', Validators.required],
          paiement_method: [''],
          check: [''],
          bank: [''],
          date: ['', Validators.required],
          place_created: ['', Validators.required],
        });
  }

  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation des Docs
    this.genDocService.getDocs()
      .then((response: GenDoc[]) => {
        this.docList = response;
        this.loading = false;
      })
      .catch((error) => { console.error(error); })
      this.schoolList  = [];
      this.genSchoolService.getSchools()
      .then((response: GenSchool[]) => {
        response.forEach((school: GenSchool) => {
          this.schoolList.push({ label: school.name, value: school._id});
        })
      })
      .catch((error) => { console.log(error); })
      this.campusList  = [];
      this.genCampusService.getCampuss()
      .then((response: GenCampus[]) => {
        response.forEach((campus: GenCampus) => {
          this.campusList.push({ label: campus.name, value: campus._id});
        })
      })
      .catch((error) => { console.log(error); })
      this.formationList  = [];
      this.genFormationService.getFormations()
      .then((response: GenCampus[]) => {
        response.forEach((formation: GenFormation) => {
          this.formationList.push({ label: formation.name, value: formation._id});
        })
      })
      .catch((error) => { console.log(error); })

      this.UserService.getPopulate(this.token.id).subscribe((userdata) => {
        this.user = userdata
      })

  }


    // methode d'ajout du cv
    onAddDoc(): void {
      // recuperation des données du formulaire
      const formValue = this.formAddDoc.value;

      const document = new GenDoc()

      console.log(formValue)
      console.log(document)

      //création du cv
      if (this.showUpdateDoc) {

        if (this.grantAccessToEdit) {
          let doc = this.showUpdateDoc;
          //Mise à jour de l'doc
          this.genDocService.updateDoc(doc).then(data => {
            this.docList.splice(this.docList.indexOf(this.showUpdateDoc), 1, doc)
            this.messageService.add({ severity: 'success', summary: "Mis à jour du doc avec succès" })
            this.formAddDoc.reset();
            this.showUpdateDoc = null;
          })
        } else {
          this.messageService.add({ severity: "error", summary: `Vous ne pouvez pas mettre à jour le doc` })
        }
        
      } else if (this.showAddDoc) {
        const document = new GenDoc()
        document.type_certif = this.type_certif
        document.school = this.school
        document.rentre = this.rentre
        document.campus = this.campus
        document.formation = this.formation
        document.alternance = formValue.alternance
        document.civilite = formValue.civilite

        this.student.full_name = formValue.student_full_name
        this.student.birth_date = formValue.student_birth_date
        this.student.birth_place = formValue.student_birth_place

        document.student = this.student
        document.amount_paid = formValue.amount_paid
        document.paiement_method = formValue.paiement_method
        document.check = formValue.check
        document.bank = formValue.bank
        document.date = formValue.date
        document.place_created = formValue.place_created
        document.id_doc = this.id_doc
        document.created_by = this.user
        document.created_on = new Date()
        //ajout du doc
        this.genDocService.addDoc(document)
          .then((response: GenDoc) => {
            this.messageService.add({ severity: "success", summary: `Le doc a été ajouté avec succés` })
            this.formAddDoc.reset();
            this.showAddDoc = false;
            this.onGetAllClasses();
          })
          .catch((error) => {
            this.messageService.add({ severity: "error", summary: `Ajout impossible` });
            console.log(error);
          });
      }
      }

  InitUpdateDoc(doc) {
    console.log(doc)
    this.showUpdateDoc = doc
    this.formAddDoc = this.formBuilder.group({
      type_certif:  doc.type_certif.value,
      school: doc.school.name,
      rentre: doc.rentre.type,
      campus: doc.campus.name,
      formation:  doc.formation.name,
      alternance: doc.alternance ,
      civilite: doc.civilite,
      student_birth_date: doc.student.birth_date,
      student_full_name: doc.student.full_name,
      bank: doc.bank,
      check: doc.check,
      student_birth_place: doc.student.birth_place,
      amount_paid: doc.amount_paid,
      paiement_method: doc.paiement_method,
      date: doc.date,
      place_created: doc.place_created,
    });

    console.log(this.formAddDoc.value)
  }

  deleteDoc(doc) {
    if (this.grantAccessToDelete) {
      this.genDocService.deleteDoc(doc).then(data => {
        this.messageService.add({ severity: 'success', summary: "Doc supprimé avec succès" })
        this.onGetAllClasses();
      })
    } else {
      this.messageService.add({ severity: "error", summary: `Vous ne pouvez pas supprimer le doc` })
    }

  }


  RemoveElementFromArray(arrayElements, element) {
    arrayElements.forEach((value,index)=>{
        if(value==element) arrayElements.splice(index,1);
    });
  }



  // Remplissage de l'attestation

  changeCertificate(val): void {
    if (val) {
      this.type_certif = this.certificate_types.find(x => x.value == val)
  } else {
    this.type_certif = null
  }
  }

  changeSchool(val): void {
    if (val) {
    this.genSchoolService.getById(val)
      .then((response: GenSchool) => {
        this.school = response
      })
      .catch((error) => { console.log(error); })
    } else {
      this.school = null
    }
  }

  changeCampus(val): void {
    if (val) {
      this.genCampusService.getById(val)
        .then((response: GenCampus) => {
          this.campus = response
        })
        .catch((error) => { console.log(error); })
  } else {
    this.campus = null
  }
  }

  changeFormation(val): void {
    this.rentreList = []
    if (val) {
      this.genFormationService.getById(val)
      .then((response: GenFormation) => {
        this.formation = response
        this.rentre = undefined
        this.genRentreService.getRentreByFormation(val)
        .then((response: GenRentre[]) => {
          response.forEach((rentre: GenRentre) => {
            this.rentreList.push({ label: rentre.type, value: rentre._id});
          })

        })
        .catch((error) => { console.log(error); })
        
    })
    .catch((error) => { console.log(error); })
    } else {
      this.formation = null
    }
  }

  changeRentre(val): void {
    if (val) {
      this.genRentreService.getById(val)
        .then((response: GenRentre) => {
          this.rentre = response
        })
        .catch((error) => { console.log(error); })
      } else {
        this.rentre = null
      }
  }

  changeCivilite(val): void {
    this.isWoman = val == "Madame" ? true : false
  }

  changePayment(val): void {
    if (val) {
      this.paiement_method = this.payementList.find(x => x.value == val).label
    } else {
      this.paiement_method = null
    }
  }

  changePays(val): void {
    if (val) {
      this.country = this.paysIsoCodes.find(x => x.value == val)
    } else {
      this.country = null
    }
  }
  onGenerateIdDoc(): void {
    this.id_doc = this.country.value + '-' + Math.floor(Math.random() * Date.now()).toString()
  }
}
