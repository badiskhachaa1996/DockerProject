import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from '../services/ecole.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import {Ecole} from '../models/Ecole'
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { NodeWithI18n } from '@angular/compiler';
import {CalendarModule} from 'primeng/calendar';
import { AnneeScolaire } from '../models/AnneeScolaire';
import {DropdownModule} from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-ecole',
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.css']
})
export class EcoleComponent implements OnInit {

  annees: AnneeScolaire[]=[]
  dropdownAnnee: any[] = [{ label: "Toutes les années", value: null }];
  ecoles:Ecole[]=[];
  showFormAddEcole:Boolean=false;
  showFormUpdateEcole:Boolean=false;
  ecoleToUpdate:Ecole;
  
  

  addecoleForm: FormGroup = new FormGroup({
    libelle : new FormControl('',[Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),
    email : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]),
    site: new FormControl('',Validators.required),
    annee_id: new FormControl('',Validators.required),
    telephone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse : new FormControl('',Validators.required),
    ville : new FormControl('PARIS',Validators.required),
    pays: new FormControl('',Validators.required),
    
  })

  ecoleFormUpdate:FormGroup = new FormGroup({  
  
  libelle : new FormControl('',[Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),
  email : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]),
  site: new FormControl('',Validators.required),
  annee_id: new FormControl('',Validators.required),
  telephone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
  adresse : new FormControl('',Validators.required),
  ville : new FormControl('PARIS',Validators.required),
  pays: new FormControl('',Validators.required),
  
  })

  columns = [
  ]

  constructor(private EcoleService:EcoleService,private messageService:MessageService,private anneeScolaireService:AnneeScolaireService,private route: ActivatedRoute ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.updateList()

    this.anneeScolaireService.getAll().subscribe((data) => {
      data.forEach(anne => {
      this.dropdownAnnee.push({ libelle: anne.libelle, value:anne._id})
      this.annees[anne._id]=anne;
   
    }, (error) => {
      console.error(error)
    });
    console.log(this.annees)
  })}

  updateList(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id!==null){
    this.EcoleService.getAllByAnnee(id).subscribe((data)=>{
      this.ecoles=data;
    })
  }
    else {
      this.EcoleService.getAll().subscribe((data)=>{
      this.ecoles=data;
    
    })}
  }

 

  saveEcole(){
    

    let ecole= new Ecole(null,this.addecoleForm.value.libelle,this.addecoleForm.value.annee_id.value,this.addecoleForm.value.ville,this.addecoleForm.value.pays,this.addecoleForm.value.adresse,this.addecoleForm.value.email,this.addecoleForm.value.site,this.addecoleForm.value.telephone)
console.log(ecole)
    this.EcoleService.create(ecole).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des écoles', detail: 'Votre ecole a bien été ajouté' });
      this.ecoles.push(data)
      this.showFormAddEcole=false;
      this.addecoleForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  editEcole(){
    let ecole= new Ecole(this.ecoleToUpdate._id,this.ecoleFormUpdate.value.libelle,this.ecoleFormUpdate.value.annee_id.value,this.ecoleFormUpdate.value.ville,this.ecoleFormUpdate.value.pays,this.ecoleFormUpdate.value.adresse,this.ecoleFormUpdate.value.email,this.ecoleFormUpdate.value.site,this.ecoleFormUpdate.value.telephone)
    console.log(ecole)
        this.EcoleService.edit(ecole).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Gestion des écoles', detail: 'Votre ecole a bien été ajouté' });
          this.ecoles.push(data)
          this.showFormUpdateEcole=false;
        
        }, (error) => {
          console.error(error)
        });

  }

  showModify(rowData:Ecole){
    console.log(rowData)
    this.ecoleToUpdate=rowData;
    this.showFormAddEcole=false;
    this.showFormUpdateEcole=true;

    this.ecoleFormUpdate.setValue({libelle:rowData.libelle,site:rowData.site,email:rowData.email,annee_id:rowData.annee_id,telephone:rowData.telephone,pays:rowData.pays,adresse:rowData.adresse,ville:rowData.ville})
  }

}
