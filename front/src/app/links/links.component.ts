import { Component, OnInit } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Links} from 'src/app/models/Links'
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
  sourceProducts!:[];
  showd: boolean = false;
  formAddLinks : FormGroup;
  constructor(
    private linksService: LinksService,
    private formBuilder: FormBuilder,
    private userService: AuthService,
  ) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;}});
    this.formAddLinks = this.formBuilder.group({
      nom: ['', Validators.required],
      lien: ['', Validators.required],
    })
  }
  showdialog(){
    this.showd=true;
  
  }
  addLinks(){
    if (this.formAddLinks.valid) {
      
      const newLink: Links = {
        user_id:this.userConnected._id,
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
  
}
