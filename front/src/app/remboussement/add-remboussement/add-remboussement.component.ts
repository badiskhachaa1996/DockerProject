
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdmissionService} from "../../services/admission.service";
import {CandidatureLeadService} from "../../services/candidature-lead.service";
import {MessageService} from "primeng/api";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../environments/environment.dev";

@Component({
  selector: 'app-add-remboussement',
  templateUrl: './add-remboussement.component.html',
  styleUrls: ['./add-remboussement.component.scss']
})
export class AddRemboussementComponent implements OnInit {
    ID = this.route.snapshot.paramMap.get('id');
    constructor(private route: ActivatedRoute, private LeadService: AdmissionService, private CandidatureService: CandidatureLeadService, private ToastService: MessageService) { }

    civilitySelect = [
        { label: "Monsieur", value: "Monsieur" },
        { label: "Madame", value: "Madame" },
        { label: "Non Précisé", value: "Non précisé" },
    ]

    ecoles = environment.entreprises

    formations = environment.formations


    //TODO à rajouter au fichier env
    motifs = [
        { label: "1"  },
        { label: "2" },
        { label: "3" },
        { label: "4" },
        { label: "5" },
        { label: "6"},
        { label: "7"},
    ]

    modePaiement = environment.modalite_paiement

    documents = [
        { label: "RIB", value: "rib" },
        { label: "Attestion de paiement", value: "attestion_paiement" },
        { label: "Preuve de paiement", value: "preuve_paiement" },
        { label: "Document d'inscription", value: "document_inscription" },
        { label: "Notification de refus (ou autre justificatif)", value: "notification_ou_autre_justificatif" },
    ]

    pays_residence = environment.pays


    formRembourssement = new FormGroup({
        civility: new FormControl(''),
        nom: new FormControl(''),
        prenom: new FormControl(''),
        date_naissance: new FormControl(''),
        nationalite: new FormControl(''),
        pays_naissance: new FormControl(''),
        indicatif_phone: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        annee_scolaire: new FormControl(''),
        ecole: new FormControl(''),
        formation: new FormControl(''),
        motif_refus: new FormControl(''),
        montant: new FormControl(''),
        modalite_paiement: new FormControl(''),
        rib: new FormControl(''),
        attestion_paiement: new FormControl(''),
        preuve_paiement: new FormControl(''),
        document_inscription: new FormControl(''),
        notification_ou_autre_justificatif: new FormControl(''),

    })

    ngOnInit(): void {

    }


    selectedDocument: string | null = null; // Variable pour stocker le document sélectionné

    onClickToAddFile(event: any, document_name: string) {
        event.preventDefault();
        this.selectedDocument = document_name;
        const fileInput = document.getElementById(document_name) as HTMLInputElement;
        fileInput.click();
    }

    onFileSelected(event: any) {
        if (!this.selectedDocument) {
            return; // Aucun document sélectionné, sortir de la fonction
        }

        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            this.formRembourssement.get(this.selectedDocument)?.setValue(selectedFile);
        } else {
            alert('Veuillez sélectionner un fichier PDF valide.');
        }

        // Réinitialiser la variable de document sélectionné après la sélection du fichier
        this.selectedDocument = null;
    }



    onSubmitRemboussementForm() {
        const formData = new FormData();
        const formValue = this.formRembourssement.value;

        for (const key of Object.keys(formValue)) {
            const value = formValue[key];

            // Vérifiez si la valeur est un fichier (instance de File)
            if (value instanceof File) {
                formData.append(key, value, value.name); // Utilisez .name pour définir le nom du fichier dans le FormData
            } else {
                formData.append(key, value);
            }

            console.log(key, value);
        }

        // Envoyez formData vers votre backend ou effectuez l'action appropriée ici
        // Par exemple, vous pouvez utiliser un service HTTP Angular pour effectuer une demande POST
        // this.myService.postData(formData).subscribe(response => {
        //   console.log('Réponse du serveur :', response);
        // });
    }


}


