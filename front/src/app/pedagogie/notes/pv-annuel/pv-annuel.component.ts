import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-pv-annuel',
  templateUrl: './pv-annuel.component.html',
  styleUrls: ['./pv-annuel.component.scss']
})
export class PvAnnuelComponent implements OnInit {

  dataPV = [{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15" }]
  cols = [{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }]
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = this.route.snapshot.paramMap.get('semestre');
  classe: Classe;
  hideForPDF = false;
  constructor(private NoteService: NoteService, private route: ActivatedRoute, private GroupeService: ClasseService) { }

  ngOnInit(): void {
    this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
      this.cols = data.cols
      this.dataPV = data.data
    })
    this.GroupeService.getPopulate(this.ID).subscribe(c => {
      this.classe = c
    })
  }

  exportPDF() {
    var element = document.getElementById('dt1');
    var opt = {
      margin: 0,
      filename: 'PV_' + this.SEMESTRE + '_' + this.classe.abbrv + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'l' }
    };
    this.hideForPDF = true
    html2pdf().set(opt).from(element).save();
  }
}
