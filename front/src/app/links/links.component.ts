import { Component, OnInit } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Links } from 'src/app/models/Links'
import { LinksService } from 'src/app/services/links.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  token: any;
  userConnected: User;
  targetProducts!: [];
  sourceProducts!: any[];
  classe1: any[] = [];
  classe2: any[]=[];
  classe3: any[]=[];
  classe4: any[]=[];
  classe5: any[]=[];
  linkToUpdate:Links;
  showd: boolean = false;
  showm: boolean = false;
  formAddLinks: FormGroup;
  formUpdateLinks: FormGroup;
  constructor(
    private linksService: LinksService,
    private formBuilder: FormBuilder,
    private userService: AuthService,
  ) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.sourceProducts = [];
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        this.linksService.getAllLinks().then((links) => {
          links.forEach((link) => {
            if (link?.classe === "classe1") {
              this.classe1.push(link);
            } else if (link?.classe === "classe2") {
              this.classe2.push(link);
            } else if (link?.classe === "classe3") {
              
              this.classe3.push(link);
            } else if (link?.classe === "classe4") {
              this.classe4.push(link);
            }
            else if (link?.classe === "classe5") {
              this.classe5.push(link);
            } else if (link.user_id == this.userConnected._id) {
              this.sourceProducts.push(link);
            }
          })
          this.classe1= Object.assign([], this.classe1)
          this.classe2= Object.assign([], this.classe2)
          this.classe3= Object.assign([], this.classe3)
          this.classe4= Object.assign([], this.classe4)
          this.classe5= Object.assign([], this.classe5)
          this.sourceProducts= Object.assign([], this.sourceProducts)
       
        })
      }});
    console.log(this.sourceProducts);
    this.formAddLinks = this.formBuilder.group({
      nom: ['', Validators.required],
      lien: ['', Validators.required],
    })
    this.formUpdateLinks = this.formBuilder.group({
      nom: ['', Validators.required],
      lien: ['', Validators.required],
    })
    console.log("****************************************************************")
console.log(this.classe1);
console.log(this.sourceProducts);
  }
  showdialog() {
    this.showd = true;

  }
  addLinks() {
    if (this.formAddLinks.valid) {

      const newLink: Links = {
        user_id: this.userConnected._id,
        nom: this.formAddLinks.get('nom').value,
        lien: this.formAddLinks.get('lien').value,
      };


      this.linksService.postLinks(newLink).then(
        (response) => {

          console.log('Lien ajouté avec succès !', response);
          this.formAddLinks.reset();
        },
        (error) => {
          // Gérez ici les erreurs, par exemple, affichez un message d'erreur
          console.error('Erreur lors de l\'ajout du lien :', error);
        }
      );
    }
  }
  SetUpdateLinks(links: Links) {
    this.linkToUpdate=links
    console.log("********************************")
    this.showm = true;
    this.formUpdateLinks = this.formBuilder.group({
      nom: links.nom,
      lien: links.lien
    });

  }
  UpdateLinks() {
    
     console.log(this.formAddLinks.get('nom').value)
      this.linkToUpdate.nom=this.formUpdateLinks.get('nom').value,
      this.linkToUpdate.lien= this.formUpdateLinks.get('lien').value,
   
    this.linksService.putLinks(this.linkToUpdate);
    this.formUpdateLinks.reset();
  }

}
