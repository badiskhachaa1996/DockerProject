import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { Partenaire } from 'src/app/models/Partenaire';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { RhService } from 'src/app/services/rh.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-prospect',
    templateUrl: './add-prospect.component.html',
    styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {

    RegisterForm2: UntypedFormGroup = new FormGroup({
        ecole: new FormControl('', [Validators.required]),
        commercial: new FormControl('',),
        source: new FormControl('', Validators.required)
    })


    nationList = environment.nationalites;
    paysList = environment.pays;
    civiliteList = environment.civilite;

    typeFormationDropdown = [
        { value: "Initiale" },
        { value: "Alternance" }
    ];

    programeFrDropdown = [

    ]

    programEnDropdown = [

    ]

    programList =
        [
            { value: "Programme Français" },
            { value: "Programme Anglais" },
        ];

    rentreeList = [

    ]

    campusDropdown =
        [
            { value: "Paris - France", label: "Paris - France" },
            { value: "Montpellier - France", label: "Montpellier - France" },
            { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
            { value: "Rabat - Maroc", label: "Rabat - Maroc" },
            { value: "La Valette - Malte", label: "La Valette - Malte" },
            { value: "UAE - Dubai", label: "UAE - Dubai" },
            { value: "En ligne", label: "En ligne" },
        ];


    newLeadForm: UntypedFormGroup = new FormGroup({
        ecole: new FormControl('', [Validators.required]),
        commercial: new FormControl('',),
        source: new FormControl('', Validators.required),


        lastname: new FormControl('', Validators.required),
        firstname: new FormControl('', Validators.required),
        civilite: new FormControl(environment.civilite[0], Validators.required),
        date_naissance: new FormControl('', Validators.required),
        nationalite: new FormControl(this.nationList[0], Validators.required),
        pays: new FormControl(this.paysList[76], Validators.required),
        email_perso: new FormControl('', Validators.required),
        indicatif: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),

        campus: new FormControl(this.campusDropdown[0]),
        rentree_scolaire: new FormControl(''),
        // programme: new FormControl(this.programList[0], Validators.required),
        formation: new FormControl('', Validators.required),
        rythme_formation: new FormControl('', Validators.required),
    })




    isPartenaireExterne = false

    ecoleList = [
        { label: "Estya", value: "estya" },
        { label: "ESPIC", value: "espic" },
        { label: "Académie des gouvernantes", value: "adg" },
        { label: "Estya Dubai", value: "estya-dubai" },
        { label: "Studinfo", value: "studinfo" },
        { label: "INTUNS", value: "intuns" },
        { label: "Intunivesity", value: "intunivesity" },
        { label: "ICBS Malte", value: "icbsmalta" },
        { label: "INT Education", value: "inteducation" }
    ]

    sourceList = [
        { label: "Partenaire", value: "Partenaire" },
        { label: "Equipe commerciale", value: "Equipe commerciale" },
        { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
        { label: "Lead", value: "Lead" },//Par défaut si Lead
        { label: "Site Web", value: "Site Web" },
        { label: "Spontané", value: "Spontané" }
    ]

    commercialList = []

    EcoleListRework = []

    constructor(private commercialService: CommercialPartenaireService, private router: Router, private ToastService: MessageService,
        private FAService: FormulaireAdmissionService, private PService: PartenaireService, private AuthService: AuthService,
        private admissionService: AdmissionService, private rhService: RhService) { }

    ngOnInit(): void {
        if (localStorage.getItem("token") != null) {
            let decodeToken: any = jwt_decode(localStorage.getItem("token"))
            this.isPartenaireExterne = decodeToken.role === 'Agent' && decodeToken.type === 'Commercial' && !decodeToken.service_id
            if (this.isPartenaireExterne) {
                this.RegisterForm2.patchValue({ source: 'Partenaire' });
                this.commercialService.getByUserId(decodeToken.id).subscribe(commercial => {
                    if (commercial) {
                        this.RegisterForm2.patchValue({ commercial: commercial.code_commercial_partenaire })
                    }
                })
            } else {
                this.commercialService.getAllPopulate().subscribe(commercials => {
                    commercials.forEach(commercial => {
                        let { user_id }: any = commercial
                        if (user_id && commercial.isAdmin)
                            this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
                    })
                    this.rhService.getCollaborateurs()
                        .then((response) => {
                            response.forEach((c: Collaborateur) => {
                                this.commercialList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c.matricule })
                            })
                        })
                        .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
                    this.PService.getAll().subscribe(commercials => {
                        this.commercialList = []
                        commercials.forEach(commercial => {
                            this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
                        })
                    })
                })
            }

            if (!this.isPartenaireExterne && (decodeToken.type == "Initial" || decodeToken.type == "Alternant"))
                this.RegisterForm2.patchValue({ source: 'Etudiant interne' });
            else if (!this.isPartenaireExterne && decodeToken.type == "Prospect")
                this.RegisterForm2.patchValue({ source: 'Lead' });


            this.FAService.EAgetAll().subscribe(data => {
                data.forEach(e => {
                    this.EcoleListRework.push({ label: e.titre, value: e.url_form })
                    //this.sourceList.push({ label: "Site web " + e.titre, value: "Site web " + e.titre })
                })
                this.sourceList = this.sourceList.concat([
                    { label: "Equipe communication", value: "Equipe communication" },
                    { label: "Bureau Congo", value: "Bureau Congo" },
                    { label: "Bureau Maroc", value: "Bureau Maroc" },
                    { label: "Collaborateur interne", value: "Collaborateur interne" },
                    { label: "Report", value: "Report" },
                    { label: "Equipe commerciale interne - bureau Tunis", value: "Equipe commerciale interne - bureau Tunis" },
                    { label: "Equipe commerciale interne - bureau Paris", value: "Equipe commerciale interne - bureau Paris" },
                    { label: "Equipe commerciale interne - bureau Montpellier", value: "Equipe commerciale interne - bureau Montpellier" },
                    { label: "Equipe commerciale interne - bureau Congo Brazzaville", value: "Equipe commerciale interne - bureau Congo Brazzaville" },
                    { label: "Equipe commerciale interne - bureau Dubaï", value: "Equipe commerciale interne - bureau Dubaï" },
                    { label: "Equipe commerciale interne - bureau Maroc", value: "Equipe commerciale interne - bureau Maroc" },

                    { label: "Site web", value: "Site web" },
                    { label: "Candidature spontanée", value: "Candidature spontanée" },
                ])
            })
        }

    }

    redirectToForm2() {
        let code = this.RegisterForm2.value.commercial
        let source = this.RegisterForm2.value.source
        source = source.replace('ECOLE', this.RegisterForm2.value.ecole)
        localStorage.setItem("sourceProspect", source)
        localStorage.setItem('agent', 'oui')
        if (!code)
            this.router.navigate(['formulaire-admission-international', this.RegisterForm2.value.ecole])
        else
            this.router.navigate(['formulaire-admission-international', this.RegisterForm2.value.ecole, code])
    }

    changeSource(source: string) {
        console.log(source)
        if (source == "Partenaire") {
            this.PService.getAll().subscribe(commercials => {
                this.commercialList = []
                commercials.forEach(commercial => {
                    this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
                })
            })
        } else {
            this.commercialService.getAllPopulate().subscribe(commercials => {
                this.commercialList = []
                commercials.forEach(commercial => {
                    let { user_id }: any = commercial
                    if (user_id && commercial.isAdmin)
                        this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
                })
                this.rhService.getCollaborateurs()
                    .then((response) => {
                        response.forEach((c: Collaborateur) => {
                            this.commercialList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c.matricule })
                        })
                    })
                    .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
                this.PService.getAll().subscribe(commercials => {
                    this.commercialList = []
                    commercials.forEach(commercial => {
                        this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
                    })
                })
            })
        }
    }


    onSelectEcole() {
        this.FAService.EAgetByParams(this.newLeadForm.value.ecole).subscribe(data => {
            this.FAService.RAgetByEcoleID(data._id).subscribe(dataEcoles => {
                let dicFilFr = {}
                let fFrList = []

                let dicFilEn = {}
                let fEnList = []
                data.formations.forEach(f => {
                    if (f.langue.includes('Programme Français')) {
                        if (dicFilFr[f.filiere]) {
                            dicFilFr[f.filiere].push({ label: f.nom, value: f.nom })
                        } else {
                            dicFilFr[f.filiere] = [{ label: f.nom, value: f.nom }]
                            fFrList.push(f.filiere)
                        }
                    }
                    //this.programeFrDropdown.push({ label: f.nom, value: f.nom })
                    if (f.langue.includes('Programme Anglais'))
                        if (dicFilEn[f.filiere]) {
                            dicFilEn[f.filiere].push({ label: f.nom, value: f.nom })
                        } else {
                            dicFilEn[f.filiere] = [{ label: f.nom, value: f.nom }]
                            fEnList.push(f.filiere)
                        }
                })
                this.programeFrDropdown = []
                fFrList.forEach(f => {
                    let ft = f
                    if (f == undefined || f == "undefined")
                        f = "Autre"
                    this.programeFrDropdown.push(
                        { label: f, value: f, items: dicFilFr[ft] }
                    )
                })
                this.programEnDropdown = []
                fEnList.forEach(f => {
                    let ft = f
                    if (f == undefined || f == "undefined")
                        f = "Autre"
                    this.programEnDropdown.push(
                        { label: f, value: f, items: dicFilEn[ft] }
                    )
                })
                this.rentreeList = []
                dataEcoles.forEach(rentre => {
                    this.rentreeList.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
                })

            })
            this.campusDropdown = []
            data.campus.forEach(c => {
                this.campusDropdown.push({ label: c, value: c })
            })
        })

    }

    addNewProspect() {
        let customid = ""
        try {
            customid = this.generateCode(this.newLeadForm.value.nationalite.value, this.newLeadForm.value.firstname, this.newLeadForm.value.lastname, this.newLeadForm.value.date_naissance)
        } catch (error) {
            customid = ""
        }
        this.admissionService.create({
            'newUser': new User(
                null,
                this.newLeadForm.value.firstname,
                this.newLeadForm.value.lastname,
                this.newLeadForm.value.indicatif,
                this.newLeadForm.value.phone,
                null,
                this.newLeadForm.value.email_perso,
                null,
                'user',
                true,
                null,
                this.newLeadForm.value.civilite.value,
                null, null, 'Prospect', null,
                this.newLeadForm.value.pays.value,
                null, null, null, null,
                this.newLeadForm.value.nationalite.value,
                null,
                new Date(),
                null, null,
                this.newLeadForm.value.campus?.value

            ), 'newProspect': new Prospect(
                null, null,
                this.newLeadForm.value.date_naissance,
                null, null, null, null, null, null,
                this.newLeadForm.value.campus?.value,
                null, null,
                this.newLeadForm.value.programme.value,
                this.newLeadForm.value.formation,
                this.newLeadForm.value.rythme_formation.value,
                null, null, null, null, true, new Date(),
                this.newLeadForm.value.ecole,
                this.newLeadForm.value.commercial,
                null, null, null, null, null, null, null, null,
                null, customid
            )
        }).subscribe(
            ((response) => {
                this.newLeadForm.reset()
                this.ToastService.add({ severity: 'success', summary: 'Création du prospect avec succès', detail: "L'inscription a été finalisé" });
            })
        );

    }
    emailExist: boolean;
    verifEmailInBD() {
        this.emailExist = false
        this.AuthService.getByEmail(this.newLeadForm.value.email_perso).subscribe((dataMail) => {
            if (dataMail) {
                this.emailExist = true
                this.ToastService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
                return true
            }
        },
            (error) => {
                return false
            })
    }
    generateCode(nation, firstname, lastname, date_naissance) {
        let code_pays = nation.substring(0, 3)
        environment.dicNationaliteCode.forEach(code => {
            if (code[nation] && code[nation] != undefined) {
                code_pays = code[nation]
            }
        })
        let prenom = firstname.substring(0, 1)
        let nom = lastname.substring(0, 1)
        let y = 0
        for (let i = 0; i < (nom.match(" ") || []).length; i++) {
            nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
            y = nom.indexOf(" ", y) + 1
        }
        let dn = new Date(date_naissance)
        let jour = dn.getDate()
        let mois = dn.getMonth() + 1
        let year = dn.getFullYear().toString().substring(2)
        let nb = new Date().getMilliseconds().toString()
        nb = nb.substring(nb.length - 3)
        let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
        return r

    }
}
