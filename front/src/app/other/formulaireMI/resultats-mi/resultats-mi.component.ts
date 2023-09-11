import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormulaireMI } from 'src/app/models/FormulaireMI';
import { FormulaireMIService } from 'src/app/services/formulaire-mi.service';

@Component({
  selector: 'app-resultats-mi',
  templateUrl: './resultats-mi.component.html',
  styleUrls: ['./resultats-mi.component.scss']
})
export class ResultatsMIComponent implements OnInit {
  resultats: FormulaireMI[] = []
  constructor(private FormulaireMIService: FormulaireMIService, private router: Router) { }

  ngOnInit(): void {
    this.FormulaireMIService.getAll().subscribe(fmi => {
      this.resultats = fmi
    })
  }

  delete(resultat: FormulaireMI) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?"))
      this.FormulaireMIService.delete(resultat._id).subscribe(data => {
        this.resultats.splice(this.resultats.indexOf(resultat), 1)
      })
  }

  goToForm() {
    this.router.navigate(['formulaire-mi'])
  }

}
