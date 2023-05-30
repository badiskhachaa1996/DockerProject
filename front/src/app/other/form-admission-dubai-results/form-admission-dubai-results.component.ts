import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AdmissionFormDubai } from 'src/app/models/AdmissionFormDubai';
import { FormAdmissionDubaiService } from 'src/app/services/form-admission-dubai.service';

@Component({
  selector: 'app-form-admission-dubai-results',
  templateUrl: './form-admission-dubai-results.component.html',
  styleUrls: ['./form-admission-dubai-results.component.scss']
})
export class FormAdmissionDubaiResultsComponent implements OnInit {

  admissionDatas: AdmissionFormDubai[] = [];
  loading: boolean = true;

  constructor(private messageService: MessageService, private formAdmissionService: FormAdmissionDubaiService) { }

  ngOnInit(): void {
    this.formAdmissionService.getDubaiAdmissions()
    .then((response) => {
      this.messageService.add({ severity: 'success', summary: 'Admissions', detail: 'Recovery of admissions list' });
      this.admissionDatas = response;
      this.loading = false;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Admissions', detail: 'Failed to retrieve admissions list', sticky: true }); });
  }

}
