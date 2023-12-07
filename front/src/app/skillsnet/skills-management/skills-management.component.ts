import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Competence } from 'src/app/models/Competence';
import { Profile } from 'src/app/models/Profile';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';

@Component({
  selector: 'app-skills-management',
  templateUrl: './skills-management.component.html',
  styleUrls: ['./skills-management.component.scss']
})
export class SkillsManagementComponent implements OnInit {

  /* Profile */
  profiles: Profile[] = [];
  showFormAddProfile: boolean = false;
  showFormUpdateProfile: boolean = false;
  formAddProfile: FormGroup;
  formUpdateProfile: FormGroup;
  profileToUpdate: Profile;
  dropdownProfile: any[] = [{ label: '', value: null }];
  profileSelected: Profile;

  /* Competence */
  competences: Competence[] = [];
  showFormAddCompetence: boolean = false;
  showFormUpdateCompetence: boolean = false;
  formAddCompetence: FormGroup;
  formUpdateCompetence: FormGroup;
  competenceToUpdate: Competence;
  showCompetenceTable: boolean = false;

  loadingCompetence: boolean = true;


  constructor(private formBuilder: FormBuilder, private skillsService: SkillsService, private userService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    // recuperation des données
    this.onGetAllClasses();

    // initialisation du formulaire d'ajout de profiles
    this.formAddProfile = this.formBuilder.group({
      libelle: ['', [Validators.required]],
    });

    // initialisation du formulaire de mise à jour de profile
    this.formUpdateProfile = this.formBuilder.group({
      libelle: ['', [Validators.required]],
    });

    // initialisation du formulaire d'ajout de competence
    this.formAddCompetence = this.formBuilder.group({
      libelle: ['', Validators.required],
    });

    // initialisation du formulaire de mise à jour de competence
    this.formUpdateCompetence = this.formBuilder.group({
      libelle: ['', Validators.required],
    });
  }


  // methde de recuperation des données
  onGetAllClasses(): void {
    // recuperation des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        this.profiles = response;

        response.forEach((profile: Profile) => {
          this.dropdownProfile.push({ label: profile.libelle, value: profile._id });
        });
      })
      .catch((error) => { console.error(error) });
  }

  // methode de recuperation de la liste des competences pour un profile
  onGetCompetenceForprofil(): void {
    // recuperation des compétences
    this.skillsService.getCompetenceByProfil(this.profileSelected._id)
      .then((response: Competence[]) => {
        this.competences = response;
        console.log(response);
        this.loadingCompetence = false;
      })
      .catch((error) => { console.error(error) });
  }

  // methode d'ajout de profile
  onAddProfile(): void {
    const formValue = this.formAddProfile.value;
    const profile = new Profile();

    profile.libelle = formValue.libelle;

    //ajout du profile
    this.skillsService.postProfile(profile)
      .then((response: Profile) => {
        this.onGetAllClasses();
        this.formAddProfile.reset();
        this.messageService.add({ severity: "success", summary: "Profile ajouté" })
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: "error", summary: "Impossible d'ajouter le profile" }); })
  }

  // methode de remplissage du formulaire de modification de profile
  onFillFormUpdateProfile(profile: Profile) {
    profile = this.profileToUpdate;

    this.formUpdateProfile.patchValue({
      libelle: profile.libelle,
    });
  }

  // methode de modification d'un profile
  onUpdateProfile(): void {
    const formValue = this.formUpdateProfile.value;
    this.profileToUpdate.libelle = formValue.libelle;

    // znvoi du profile
    this.skillsService.putProfile(this.profileToUpdate)
      .then((response: Profile) => {
        this.onGetAllClasses();
        this.formUpdateProfile.reset();
        this.messageService.add({ severity: "success", summary: "Profile modifié" })
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: "error", summary: "Impossible de modifier le profile" }); })
  }

  // methode d'ajout d'une nouvelle compétences
  onAddCompetence(): void {
    const formValue = this.formAddCompetence.value;
    const competence = new Competence();

    competence.libelle = formValue.libelle;
    competence.profile_id = this.profileSelected._id;

    // ajout de la competence dans la base de données
    this.skillsService.postCompetence(competence)
      .then((response: Competence) => {
        this.formAddCompetence.reset();
        this.onGetAllClasses();
        this.onGetCompetenceForprofil();
        this.messageService.add({ severity: "success", summary: "Compétence ajouté" });
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: "error", summary: "Impossible d'ajouter la compétence" }); })
  }

  // methode de remplissage du formulaire de modification d'une compétence
  onFillFormUpdateCompetence(competence: Competence): void {
    competence = this.competenceToUpdate;
    let byPassProfile: any = competence.profile_id

    this.formUpdateCompetence.patchValue({
      libelle: competence.libelle,
    });
  }

  // methode de modification d'une compétence
  onUpdateCompetence(): void {
    const formValue = this.formUpdateCompetence.value;
    this.competenceToUpdate.libelle = formValue.libelle;
    this.competenceToUpdate.profile_id = this.profileSelected._id;

    // envoi de la competence
    this.skillsService.putCompetence(this.competenceToUpdate)
      .then((response: Competence) => {
        this.formUpdateCompetence.reset();
        this.onGetAllClasses();
        this.onGetCompetenceForprofil();
        this.messageService.add({ severity: "success", summary: "Compétence modifié" });
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: "error", summary: "Impossible de modifier la compétence" }); });
  }

  onDeleteSkill(competence: Competence) {
    if (confirm('Etes-vous sûr de vouloir supprimer ' + competence?.libelle + ' ?'))
      this.skillsService.delete(competence._id).then(r => {
        this.competences.splice(this.competences.indexOf(competence), 1)
      })
  }
}
