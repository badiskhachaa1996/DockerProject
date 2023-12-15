import { User } from "./User";
import { Evaluation } from "./evaluation";

export class Prospect {

    constructor(
        public _id?: string,
        public user_id?: any,
        public date_naissance?: Date,
        public numero_whatsapp?: string,
        public validated_academic_level?: string,
        public statut_actuel?: string,
        public other?: string,
        public languages?: string,
        public professional_experience?: string,
        public campus_choix_1?: string,
        public campus_choix_2?: string,
        public campus_choix_3?: string,
        public programme?: string,
        public formation?: string,
        public rythme_formation?: string,
        public servicesEh?: Boolean[],
        public nomGarant?: string,
        public prenomGarant?: string,
        public nomAgence?: string,
        public donneePerso?: boolean,
        public date_creation?: Date,
        public type_form?: string,
        public code_commercial?: string,
        public statut_dossier?: string,
        public date_traitement?: string,
        public etat_dossier?: string,
        public tcf?: string,
        public agent_id?: string,
        public indicatif_whatsapp?: string,
        public decision_admission?: string,
        public statut_payement?: string,
        public phase_complementaire?: string,
        public customid?: string,
        public traited_by?: string,
        public validated_cf?: string,
        public payement?: any[],
        public avancement_visa?: string,
        public enTraitement?: boolean,
        public etat_traitement?: string,
        public nir?: string,
        public mobilite_reduite?: boolean,
        public sportif_hn?: boolean,
        public horsAdmission?: boolean,
        public archived?: boolean,
        public document_manquant?: string[],
        public document_present?: string[],
        public remarque?: string,
        public dossier_traited_by?: string,
        public haveDoc?: boolean,
        public origin?: string,
        public source?: string,
        public rentree_scolaire?: string,
        public isCalled?: boolean,
        public numeroAgence?: string,
        public languages_fr?: string,
        public languages_en?: string,
        public numero_telegram?: string,
        public indicatif_telegram?: string,
        public montant_paye?: number,
        public decision_orientation?: string[],
        public phase_candidature?: string,
        public agent_sourcing_id?: string,
        public date_sourcing?: Date,
        public a_besoin_visa?: string,
        public finance?: string,
        public logement?: string,
        public team_sourcing_id?: string,
        public contact_date?: Date,
        public contact_orientation?: string,
        public avancement_orientation?: string,
        public note_avancement?: string,
        public note_decision?: string,
        public note_dossier?: string,
        public note_phase?: string,
        public niveau_langue?: string,
        public dossier_traited_date?: Date,
        public procedure_peda?: string,
        public numero_dossier_campus_france?: string,
        public consulaire_traited_by?: string,
        public consulaire_date?: Date,
        public note_dossier_cf?: string,
        public note_consulaire?: string,
        public documents_administrative?: [{ date: Date, nom: string, path: string, traited_by: string, note: string, custom_id: string, type: string }],
        public modalite?: string,
        public documents_dossier?: [{ date: Date, nom: string, path: string, _id: string }],
        public documents_autre?: [{ date: Date, nom: string, path: string, _id: string }],
        public avancement_cf?: string,
        public date_orientation?: Date,
        public date_admission?: Date,
        public date_cf?: Date,
        public date_visa?: Date,
        public date_inscription_def?: Date,
        public lead_type?: String,
        public rue_adresse?: String,
        public numero_adresse?: String,
        public evaluation?: [{ name: string, Score: string, duree: number, date_envoi: Date, date_passage: Date }],
        public entretien?: { date_entretien: Date, Duree: number, niveau: string, parcours: string, choix: string },
        public decision?: { decision_admission: string, expliquation: string, date_decision: Date, membre: [User] },
        public teams?: String,
        public Ypareo?: string,
        public groupe?: string,
        public ecole?: string,
        public payement_programme?: [{ type: string, montant: number, date: Date, ID: string, doc: string, motif: string, etat: string }],
        public ville_adresse?: string,
        public sos_lastname?: string,
        public sos_firstname?: string,
        public sos_email?: string,
        public sos_phone?: string,
        public evaluations?: [
            {
                evaluation_id?: Evaluation,
                etat?: string,
                score?: number,
                date_passation?: Date,
                date_envoie?: Date,
                duree_mise?: number,
                date_expiration?: Date,
                commentaire?: string
            }
        ]
    ) { }

}