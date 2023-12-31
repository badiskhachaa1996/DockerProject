import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressionPeda } from 'src/app/models/ProgressionPeda';
import { Seance } from 'src/app/models/Seance';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressionPedaService } from 'src/app/services/pedagogie/progression-peda.service';
import * as html2pdf from 'html2pdf.js';
import { MatiereService } from 'src/app/services/matiere.service';
import { FormateurService } from 'src/app/services/formateur.service';

@Component({
  selector: 'app-progression-pedagogique',
  templateUrl: './progression-pedagogique.component.html',
  styleUrls: ['./progression-pedagogique.component.scss']
})
export class ProgressionPedagogiqueComponent implements OnInit {
  hideForPDF = false
  constructor(private router: Router, private route: ActivatedRoute, private PPService: ProgressionPedaService,
    private AuthService: AuthService, private ModuleService: MatiereService, private FormateurService: FormateurService) { }
  ID = this.route.snapshot.paramMap.get('formateur_id');
  FORMATEUR: User;
  ppList: ProgressionPeda[] = [];
  dropdownModule = [{ label: 'Tous les modules', value: null }]
  ngOnInit(): void {

    this.PPService.getAllByUserID(this.ID).subscribe(data => {
      this.ppList = data
      let moduleID = []
      data.forEach(pp => {
        let ps: any = pp.seance_id
        if (!moduleID.includes(ps.matiere_id._id)) {
          this.dropdownModule.push({ label: ps.matiere_id.abbrv, value: ps.matiere_id._id })
          moduleID.push(ps.matiere_id._id)
        }
      })
    })
    this.AuthService.getPopulate(this.ID).subscribe(data => {
      this.FORMATEUR = data
    })

  }

  getDuree(seance: Seance) {
    let d_b = new Date(seance.date_debut)
    let d_f = new Date(seance.date_fin)
    let h = d_f.getHours() - d_b.getHours()
    let m = Math.abs(d_f.getMinutes() - d_b.getMinutes())
    return h.toString() + "H" + m.toString()
  }

  seeSeance(seance) {
    this.router.navigate(['pedagogie/emergement', seance._id])
  }

  exportPDF() {
    var element = document.getElementById('dt2');
    var opt = {
      margin: 0,
      filename: 'PROGESSION_PEDAGOGIQUE_' + this.FORMATEUR.lastname + " " + this.FORMATEUR.firstname + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'l', hotfixes: ['px_scaling'] }
    };
    this.hideForPDF = true
    html2pdf().set(opt).from(element).save().then(() => {
      this.hideForPDF = false
      //element.style.transform = '';
    });
  }

}
