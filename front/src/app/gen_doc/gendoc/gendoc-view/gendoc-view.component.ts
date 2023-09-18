import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';
import { GenDocService } from 'src/app/services/gen_doc/gendoc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gendoc-view',
  templateUrl: './gendoc-view.component.html',
  styleUrls: ['./gendoc-view.component.scss']
})
export class GendocViewComponent implements OnInit {


 isWoman: Boolean;
 type_certif;
 formContent = {
  type_certif:  '',
  school: '',
  rentre: '',
  campus: '',
  formation:  '',
  alternance: false,
  civilite: '',
  student_birth_date: '',
  student_full_name: '',
  bank: '',
  check: '',
  student_birth_place: '',
  amount_paid:'',
  paiement_method: '',
  date: '',
  place_created: '',
}
 school;
 campus;
 formation;
 rentre;
 paiement_method;
 student;
 country;
 id_doc;

 paysIsoCodes = environment.isoCodes;


 document: GenDoc

  constructor(private route: ActivatedRoute, gendocService: GenDocService) { 
    this.id_doc  = this.route.snapshot.paramMap.get('id_doc')
    
    gendocService.getDoc(this.id_doc).subscribe((data) => {
      this.document = data
      console.log(this.document)
      this.isWoman = this.document.civilite == "Madame" ? true : false
      this.country = this.paysIsoCodes.find(x => x.label == this.document.student.birth_place)
      this.type_certif = this.document.type_certif
      this.student = this.document.student
      this.paiement_method = this.document.paiement_method
      this.school = this.document.school
      this.campus = this.document.campus
      this.formation = this.document.formation
      this.rentre = this.document.rentre

      this.formContent = {
          type_certif:  this.document.type_certif.value,
          school: this.document.school.name,
          rentre: this.document.rentre.type,
          campus: this.document.campus.name,
          formation:  this.document.formation.name,
          alternance: this.document.alternance ,
          civilite: this.document.civilite,
          student_birth_date: this.document.student.birth_date,
          student_full_name: this.document.student.full_name,
          bank: this.document.bank,
          check: this.document.check,
          student_birth_place: this.document.student.birth_place,
          amount_paid: this.document.amount_paid,
          paiement_method: this.document.paiement_method,
          date: this.document.date,
          place_created: this.document.place_created,
      }

      console.log(this.id_doc)
      console.log(this.school)
    })

  }

  ngOnInit(): void {

  }

}
