import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { AdmissionFormDubai } from 'src/app/models/AdmissionFormDubai';
import { FormAdmissionDubaiService } from 'src/app/services/form-admission-dubai.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-admission-dubai',
  templateUrl: './form-admission-dubai.component.html',
  styleUrls: ['./form-admission-dubai.component.scss']
})
export class FormAdmissionDubaiComponent implements OnInit {

  formAdmission: FormGroup;
  showFormAdmission: boolean = true;
  formData: AdmissionFormDubai;
  nationalities: any[] = [];
  countries: any[] = [];
  // liste des diplôme pour la selection dans le form
  diplomas: any[] = [];
  // liste pour le bouton radio de la partie intake, dernier element du formulaire
  intakes: any[] = [
    { name: 'October 2023', key: 'A' },
    { name: 'January 2024', key: 'B' },
    { name: 'All year (for short term courses)', key: 'C' },
  ];
  // variable pour afficher ou masquer le champs other
  showOther: boolean = false;

  // variables utilisé pour les chaps téléphone et whatsapp
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

  // liste pour le choix du programme
  chosenProgramList: SelectItemGroup[];

  constructor(private formBuilder: FormBuilder, private formAdmissionDubaiService: FormAdmissionDubaiService, private messageService: MessageService) { }

  ngOnInit(): void {
    // initialisation des variables
    this.nationalities = environment.paysEnglish;
    this.countries = environment.paysEnglish;
    this.diplomas = [
      { label: 'Highschool degree', value: 'Highschool degree' },
      { label: '1st year undergraduate', value: '1st year undergraduate' },
      { label: '2nd year undergraduate', value: '2nd year undergraduate' },
      { label: '3rd year undergraduate', value: '3rd year undergraduate' },
      { label: '1st year masters', value: '1st year masters' },
      { label: '2nd year masters', value: '2nd year masters' },
      { label: 'Other', value: 'Other' },
    ];

    this.chosenProgramList = [
      {
        label: 'English Language courses',
        value: 'elc',
        items: [
          { label: 'General English', value: 'General English' },
          { label: 'Business English', value: 'Business English' },
          { label: 'Preparation For IELTS', value: 'Preparation For IELTS' },
          { label: 'English Foundation Year', value: 'English Foundation Year' },
        ]
      },
      {
        label: 'French courses',
        value: 'fc',
        items: [
          { label: 'General French', value: 'General French' },
          { label: 'TCF Preparation', value: 'TCF Preparation' },
          { label: 'New York', value: 'New York' },
          { label: 'TCF Canada Preparation', value: 'TCF Canada Preparation' }
        ]
      },
      {
        label: 'Arabic courses',
        value: 'ac',
        items: [
          { label: 'Arabic for non-arabic speakers', value: 'Arabic for non-arabic speakers' },
        ]
      },
      {
        label: 'Certified courses',
        value: 'cc',
        items: [
          { label: 'Communication in Business', value: 'Communication in Business' },
          { label: 'Leadership and Team Management', value: 'Leadership and Team Management' },
          { label: 'Personal and Professional Development', value: 'Personal and Professional Development' },
        ]
      },
      {
        label: 'English Diplomas',
        value: 'ed',
        items: [
          { label: 'Foundation Diploma in Higher Education Studies', value: 'Foundation Diploma in Higher Education Studies' },
          { label: 'Level 4 diploma in Business Management', value: 'Level 4 diploma in Business Management' },
          { label: 'Level 5 diploma in Business Management', value: 'Level 5 diploma in Business Management' },
          { label: 'Level 4 diploma in Accounting and Business', value: 'Level 4 diploma in Accounting and Business' },
          { label: 'Level 5 diploma in Accounting and Business', value: 'Level 5 diploma in Accounting and Business' },
          { label: 'Level 4 diploma in Tourism and Hospitality Management', value: 'Level 4 diploma in Tourism and Hospitality Management' },
          { label: 'Level 5 diploma in Tourism and Hospitality Management', value: 'Level 5 diploma in Tourism and Hospitality Management' },
          { label: 'Level 4 diploma in Information Technology', value: 'Level 4 diploma in Information Technology' },
          { label: 'Level 5 Diploma in Information Technology', value: 'Level 5 Diploma in Information Technology' },
          { label: 'Level 4 diploma in Education and Training Management', value: 'Level 4 diploma in Education and Training Management' },
          { label: 'Level 5 diploma in Education and Training Management', value: 'Level 5 diploma in Education and Training Management' },
        ]
      }
    ];

    // initialisation du formulaire d'admission
    this.onInitFormAdmission();
  }

  // méthode d'initialisation du formulaire d'admission
  onInitFormAdmission(): void {
    this.formAdmission = this.formBuilder.group({
      full_name: ['', Validators.required],
      email_address: ['', Validators.required],
      phone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      nationality: ['', Validators.required],
      country_of_residence: ['', Validators.required],
      last_diploma: ['', Validators.required],
      other: [''],
      chosen_program: ['', Validators.required],
      intake: ['', Validators.required],
    });
  }

  // méthode d'affichage du champs other si le visiteur choisis other dans le formulaire
  onShowOther(event): void {
    event.value === 'Other' ? this.showOther = true : this.showOther = false;
  }

  // traitement des erreurs du formulaire
  get full_name() { return this.formAdmission.get('full_name'); }
  get email_address() { return this.formAdmission.get('email_address'); }
  get phone() { return this.formAdmission.get('phone'); }
  get whatsapp() { return this.formAdmission.get('whatsapp'); }
  get nationality() { return this.formAdmission.get('nationality'); }
  get country_of_residence() { return this.formAdmission.get('country_of_residence'); }
  get last_diploma() { return this.formAdmission.get('last_diploma'); }
  get chosen_program() { return this.formAdmission.get('chosen_program'); }
  get intake() { return this.formAdmission.get('intake'); }

  // envoi des données en BD
  onAdd(): void {
    const formValue = this.formAdmission.value;
    const admissionData = new AdmissionFormDubai;

    admissionData.full_name = formValue.full_name;
    admissionData.email_address = formValue.email_address;
    admissionData.phone = formValue.phone;
    admissionData.whatsapp = formValue.whatsapp;
    admissionData.nationality = formValue.nationality;
    admissionData.country_of_residence = formValue.country_of_residence;

    // choix du dernier diplôme si le visiteur choisis other
    formValue.last_diploma === 'Other' ? admissionData.last_diploma = formValue.other: admissionData.last_diploma = formValue.last_diploma;

    admissionData.chosen_program = formValue.chosen_program;
    admissionData.intake = formValue.intake.name;
    admissionData.date = new Date();

    // pour utiliser formData dans le html à la soumission du formulaire
    this.formData = admissionData;

    this.formAdmissionDubaiService.postDubaiAdmission(admissionData)
    .then((response) => {
      this.messageService.add({ severity: 'success', summary: 'Admission', detail: 'Your admission request has been taken into account' });
      this.formAdmission.reset();
      this.showFormAdmission = false;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Admission', detail: 'Unable to consider your admission request' }) });
  }

}
