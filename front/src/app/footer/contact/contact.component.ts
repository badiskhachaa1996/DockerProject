import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { contactService } from '../../services/contact.service';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactform: FormGroup;
  civiliteList = environment.civilite;

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private router: Router, private ContactService: contactService) { }

  ngOnInit(): void {
    this.onInitContactForm();
  }

  onInitContactForm() {
    this.contactform = this.formBuilder.group({
      civilite: new FormControl(environment.civilite[0], [Validators.required]),
      nom: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      prenom: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl('', [Validators.required]),
    })

  }

  get civilite() { return this.contactform.get('civilite').value.value; }
  get nom() { return this.contactform.get('nom').value; };
  get prenom() { return this.contactform.get('prenom').value; }
  get email() { return this.contactform.get('email').value; };
  get description() { return this.contactform.get('description').value; };

  register() {
    let messageObject = {
      civilite: this.civilite,
      lastname: this.nom,
      firstname: this.prenom,
      mail: this.email,
      des: this.description,
    }

    console.log(messageObject)

    this.ContactService.sendEmail(messageObject).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Message envoyé avec succès' })
    })

  }

}




