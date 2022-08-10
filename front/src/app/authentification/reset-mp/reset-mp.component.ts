import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-mp',
  templateUrl: './reset-mp.component.html',
  styleUrls: ['./reset-mp.component.scss']
})
export class ResetMpComponent implements OnInit {

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  updatePwdForm: FormGroup = new FormGroup({
    nv_mp: new FormControl('', [Validators.required, Validators.minLength(8)]),
    nv_mpC: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });



  get nv_mp() { return this.updatePwdForm.get('nv_mp'); }
  get nv_mpC() { return this.updatePwdForm.get('nv_mp'); }
  Onupdatepwd() {

    if (this.updatePwdForm.get('nv_mp').value == this.updatePwdForm.get('nv_mpC').value) {
      
      this.authService.reinitPwd(this.activatedRoute.snapshot.params.pwdtokenID, this.nv_mp.value).subscribe(reinitpwdData => {
        this.messageService.add({ severity: 'success', summary: 'Modification mot de passe ', detail: 'Mot de passe modifié avec succes' });
       this.updatePwdForm.disable()
      }, (err => { console.log(err) }))
    }
    else {
      this.updatePwdForm.reset();
      this.messageService.add({ severity: 'error', summary: 'Modification mot de passe ', detail: 'les mots de passe doivent étre identiques' });
    }

  }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params.pwdtokenID)


  }

}
