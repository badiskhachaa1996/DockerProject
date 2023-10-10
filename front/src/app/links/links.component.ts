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
  role: boolean=false;
  links1:any[]=[];links2:any[]=[];links3:any[]=[];links4:any[]=[];links5:any[]=[];links6:any[]=[];
  classe1: any[] = [];classe2: any[]=[];classe3: any[]=[];classe4: any[]=[];classe5: any[]=[];classse6: any[] = [];
  linkToUpdate:Links;
  showd1: boolean = false;
  showd2: boolean = false;
  showd3: boolean = false;
  showd4: boolean = false;
  showd5: boolean = false;
  showd6: boolean = false;
  showdA: boolean = false;
  showdB: boolean = false;
  showdC: boolean = false;
  showdD: boolean = false;
  showdE: boolean = false;
  showdF: boolean = false;
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
    this.userConnected.roles_list.forEach(element => {
          if ( element.module=="Links" && element.role=="Super-Admin"){
            this.role=true 
          }
        });
        this.linksService.getAllLinks().then((links) => {
          links.forEach((link) => {
            if (link?.classe === "Global") {
              this.classe1.push(link);
            } else if (link?.classe === "Board") {
              this.classe2.push(link);
            } else if (link?.classe === "Process") {
              
              this.classe3.push(link);
            } else if (link?.classe === "IGM events") {
              this.classe4.push(link);
            }
            else if (link?.classe === "IGM links") {
              this.classe5.push(link);

            }
            else if (link?.classe === "Other") {
              this.classe5.push(link);
              
            }else if (link.user_id == this.userConnected._id && link?.classe === "links1") {
              this.links1.push(link);
            }else if (link.user_id == this.userConnected._id && link?.classe === "links2") {
              this.links2.push(link);
            }else if (link.user_id == this.userConnected._id && link?.classe === "links3") {
              this.links3.push(link);
            }else if (link.user_id == this.userConnected._id && link?.classe === "links4") {
              this.links4.push(link);
            }else if (link.user_id == this.userConnected._id && link?.classe === "links5") {
              this.links5.push(link);
            }else if (link.user_id == this.userConnected._id && link?.classe === "links6") {
              this.links6.push(link);
            }
          })
          this.classe1= Object.assign([], this.classe1);this.classe2= Object.assign([], this.classe2)
          this.classe3= Object.assign([], this.classe3);this.classe4= Object.assign([], this.classe4)
          this.classe5= Object.assign([], this.classe5);this.links1= Object.assign([], this.links1);
          this.links2= Object.assign([], this.links2);this.links3= Object.assign([], this.links3);
          this.links4= Object.assign([], this.links4);this.links5= Object.assign([], this.links5);
          this.links6= Object.assign([], this.links6);this.sourceProducts= Object.assign([], this.sourceProducts);
       
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
  showdialog1() {this.showd1 = true;};showdialog2() {this.showd2 = true;};showdialog3() {this.showd3 = true;};
  showdialog4() {this.showd4 = true;};showdialog5() {this.showd5 = true;};showdialog6() {this.showd6 = true;};
  showdialogA() {this.showdA = true;};showdialogB() {this.showdB = true;};showdialogC() {this.showdC = true;};
  showdialogD() {this.showdD = true;};showdialogE() {this.showdE = true;};showdialogF() {this.showdF = true;};
  addLinks(classe:string) {
    if (this.formAddLinks.valid) {

      const newLink: Links = {
        user_id: this.userConnected._id,
        nom: this.formAddLinks.get('nom').value,
        lien: this.formAddLinks.get('lien').value,
        classe:classe
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
  onDeleteLinks(id:string) {
    this.linksService.delete(id);
}
}