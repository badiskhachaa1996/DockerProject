import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
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

  contactform: UntypedFormGroup;
  civiliteList = environment.civilite;

  constructor(private messageService: MessageService, private formBuilder: UntypedFormBuilder, private router: Router, private ContactService: contactService) { }

  ngOnInit(): void {
    this.onInitContactForm();
  }

  onInitContactForm() {
    this.contactform = this.formBuilder.group({
      civilite: new UntypedFormControl(environment.civilite[0], [Validators.required]),
      nom: new UntypedFormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      prenom : new UntypedFormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      description: new UntypedFormControl('', [Validators.required]),
    })

  }

  get civilite() { return this.contactform.get('civilite').value.value; }
  get nom() { return this.contactform.get('nom').value; };
  get prenom() { return this.contactform.get('prenom').value; }
  get email() { return this.contactform.get('email').value; };
  get description() { return this.contactform.get('description').value; };

  register() {
    let messageObject = {
      civilite : this.civilite,
      lastname: this.nom,
      firstname: this.prenom,
      mail: this.email,
      des: this.description,
    }

    console.log(messageObject)

    this.ContactService.sendEmail(messageObject).subscribe((data) => {
      let res = data;
      res.send("ok");
      console.log("ok");
    })

  }

}




