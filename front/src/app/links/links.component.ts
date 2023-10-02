import { Component, OnInit } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Links} from 'src/app/models/Links'
import { LinksService } from 'src/app/services/links.service';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  targetProducts!: [];
  sourceProducts!:[];
  showd: boolean = false;
  formAddLinks : FormGroup;
  constructor(
    private linksService: LinksService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
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
      // Créez une instance de Links à partir des valeurs du formulaire
      const newLink: Links = {
        nom: this.formAddLinks.get('nom').value,
        lien: this.formAddLinks.get('lien').value,
      };
  
      // Appelez le service pour ajouter le lien
      this.linksService.postLinks(newLink).then(
        (response) => {
          // Gérez ici la réponse après l'ajout réussi, par exemple, réinitialisez le formulaire
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
