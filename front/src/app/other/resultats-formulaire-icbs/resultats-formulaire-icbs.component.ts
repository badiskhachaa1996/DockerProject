import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormulaireICBS } from 'src/app/models/FormulaireICBS';
import { FormulaireIcbsService } from 'src/app/services/other/formulaire-icbs.service';

@Component({
  selector: 'app-resultats-formulaire-icbs',
  templateUrl: './resultats-formulaire-icbs.component.html',
  styleUrls: ['./resultats-formulaire-icbs.component.scss']
})
export class ResultatsFormulaireIcbsComponent implements OnInit {
  resultats: FormulaireICBS[] = []
  constructor(private FICBSService: FormulaireIcbsService, private router: Router) { }

  ngOnInit(): void {
    this.FICBSService.getAll().subscribe(data => {
      this.resultats = data
    })
  }

  delete(resultat: FormulaireICBS) {
    if (confirm("Do you really want to delete this row ?"))
      this.FICBSService.delete(resultat._id).subscribe(data => {
        this.resultats.splice(this.resultats.indexOf(resultat), 1)
      })
  }

  goToForm() {
    this.router.navigate(['questionnaire-icbs'])
  }

}
