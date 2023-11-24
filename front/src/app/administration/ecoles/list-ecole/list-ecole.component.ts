import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from 'src/app/services/ecole.service';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { Ecole } from 'src/app/models/Ecole'
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';

@Component({
  selector: 'app-list-ecole',
  templateUrl: './list-ecole.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-ecole.component.scss']
})
export class ListEcoleComponent implements OnInit {


  annees: AnneeScolaire[] = []
  dropdownAnnee: any[] = [{ libelle: "Toutes les années", value: null }];
  ecoles: Ecole[] = [];
  showFormAddEcole: Boolean = false;
  showFormUpdateEcole: Boolean = false;
  ecoleToUpdate: Ecole;
  AnneeSelected: AnneeScolaire;

  showFormAddImage: boolean = false;
  ecoleSelected: Ecole;

  ecoleFormUpdate: FormGroup = new FormGroup({

    libelle: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@elitech+\.education)|(@eduhorizons+\.com)|(@academiedesgouvernantes+\.com))$")]),
    site: new FormControl('', Validators.required),
    annee_id: new FormControl('', Validators.required),
    telephone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl('', Validators.required),
    ville: new FormControl('PARIS', [Validators.required, Validators.pattern('[^0-9]+')]),
    pays: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),

  })

  columns = [
  ]
  token;

  logo: any;
  cachet: any;
  pied_de_page: any;

  constructor(private EcoleService: EcoleService, private messageService: MessageService, private anneeScolaireService: AnneeScolaireService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else if (this.token["role"].includes("user")) {
      this.router.navigate(["/ticket/suivi"])
    }
    const id = this.route.snapshot.paramMap.get('id');
    this.updateList()

    this.anneeScolaireService.getAll().subscribe((data) => {
      data.forEach(anne => {
        this.dropdownAnnee.push({ libelle: anne.libelle, value: anne._id })
        this.annees[anne._id] = anne;

      }, (error) => {
        console.error(error)
      });
    })
    this.anneeScolaireService.getByID(id).subscribe((data) => {
      this.AnneeSelected = data.dataAnneeScolaire
    })


  }

  updateList() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.EcoleService.getAllByAnnee(id).subscribe((data) => {
        this.ecoles = data;
      })
    }
    else {
      this.EcoleService.getAll().subscribe((data) => {
        this.ecoles = data;

      })
    }
  }

  editEcole() {

    let ecoleupdated = new Ecole(this.ecoleToUpdate._id, this.ecoleFormUpdate.value.libelle, this.ecoleFormUpdate.value.annee_id.value, this.ecoleFormUpdate.value.ville, this.ecoleFormUpdate.value.pays, this.ecoleFormUpdate.value.adresse, this.ecoleFormUpdate.value.email, this.ecoleFormUpdate.value.site, this.ecoleFormUpdate.value.telephone)
    this.EcoleService.edit(ecoleupdated).subscribe((data2) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des écoles', detail: 'Votre ecole a bien été modifié' });
      this.updateList();
      this.showFormUpdateEcole = false;

    }, (error) => {
      console.error(error)
    });

  }

  showModify(rowData: Ecole) {
    this.ecoleToUpdate = rowData
    this.showFormAddEcole = false;

    this.ecoleFormUpdate.setValue({ libelle: rowData.libelle, site: rowData.site, email: rowData.email, annee_id: rowData.annee_id, telephone: rowData.telephone, pays: rowData.pays, adresse: rowData.adresse, ville: rowData.ville })
    this.showFormUpdateEcole = true;
  }


  navigatetoCampus(rowData: Ecole) {

    this.router.navigate(['/campus', rowData._id]);

  }

  //Click sur le logo
  clickLogo() {
    document.getElementById('selectLogo').click();
  }

  //Methode de selection du logo
  selectLogo(event) {
    if (event.target.files.length > 0) {
      this.logo = event.target.files[0];
    }
  }

  //Methode d'ajout d'un nouveau logo
  onAddLogo(ecole: Ecole) {
    ecole = this.ecoleSelected;
    ecole.logo = this.logo.name;

    let formData = new FormData();
    formData.append('id', ecole._id);
    formData.append('file', this.logo);

    //Mise à jour de l'école
    this.EcoleService.edit(ecole).subscribe(
      ((response) => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des écoles', detail: 'Le logo a bien été modifié' });

        this.EcoleService.sendLogo(formData).subscribe(
          ((response) => { }),
          ((error) => { console.error(error); })
        );

      }),
      ((error) => { console.error(error); })
    );
    //this.showFormAddImage = false;
  }


  //Methode de selection du pied de page
  selectPp(event) {
    if (event.target.files.length > 0) {
      this.pied_de_page = event.target.files[0];
    }
  }

  //Methode d'ajout d'un pied de page
  onAddPp(ecole: Ecole) {
    ecole = this.ecoleSelected;
    ecole.pied_de_page = this.pied_de_page.name;

    let formData = new FormData();
    formData.append('id', ecole._id);
    formData.append('file', this.pied_de_page);

    this.EcoleService.edit(ecole).subscribe(
      ((response) => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des écoles', detail: 'Le pied de page a bien été modifié' });

        this.EcoleService.sendPp(formData).subscribe(
          ((response) => {

          }),
          ((error) => { console.error(error); })
        );
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode de selection d'un cachet
  selectCachet(event) {
    if (event.target.files.length > 0) {
      this.cachet = event.target.files[0]
    }
  }

  //Methode d'ajout d'un cachet
  onAddCachet(ecole: Ecole) {
    ecole = this.ecoleSelected;
    ecole.cachet = this.cachet.name;

    let formData = new FormData();
    formData.append('id', ecole._id);
    formData.append('file', this.cachet);

    this.EcoleService.edit(ecole).subscribe(
      ((response) => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des écoles', detail: 'Le cachet a bien été modifié' });

        this.EcoleService.sendCachet(formData).subscribe(
          ((response) => { }),
          ((error) => { console.error(error); })
        );
      }),
      ((error) => { console.error(error); })
    );
  }



  //Methode pour rediriger vers le formulaire d'ajout d'une école
  onRedirect() {
    this.router.navigate(['/ajout-ecole']);
  }



}
