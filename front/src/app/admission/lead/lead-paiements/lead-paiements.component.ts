import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-lead-paiements',
  templateUrl: './lead-paiements.component.html',
  styleUrls: ['./lead-paiements.component.scss']
})
export class LeadPaiementsComponent implements OnInit {

  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService) { }

  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
      })
  }

  downloadAdminFile(path) {
    this.ProspectService.downloadFileAdmin(this.PROSPECT._id, path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })

  }
}
