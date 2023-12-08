import { User } from "./User";

export class LeadCRM {
    constructor(
        public source?: string,
        public operation?: string,
        public statut_dossier?: string,
        public civilite?: string,
        public nom?: string,
        public prenom?: string,
        public pays_residence?: string,
        public email?: string,
        public indicatif_phone?: string,
        public numero_phone?: string,
        public date_naissance?: Date,
        public nationalite?: string,
        public indicatif_whatsapp?: string,
        public numero_whatsapp?: string,
        public indicatif_telegram?: string,
        public numero_telegram?: string,
        public dernier_niveau_academique?: string,
        public statut?: string,
        public niveau_fr?: string,
        public niveau_en?: string,
        public date_creation?: Date,
        public custom_id?: string,
        //Contact
        public contacts?: {
            date_contact?: Date,
            contact_by?: any,
            canal?: string,
            suite_contact?: string,
            note?: string,
            _id?: string,
        }[],
        //Ventes
        public ventes?: {
            date_paiement?: Date,
            montant_paye?: string,
            modalite_paiement?: string,
            note?: string,
            _id?: string,
        }[],
        //Mailing
        public mailing?: {
            date_envoie?: Date,
            objet_mail?: string,
            note?: string,
            _id?: string,
        }[],
        public send_mail?: string,

        //Qualification
        public produit?: any,
        public criteres_qualification?: any,
        public decision_qualification?: string,
        public note_qualification?: string,

        //Affectation
        public affected_date?: Date,
        public affected_to_member?: User,

        //Choix Prospects
        public rythme?: string,
        public ecole?: string,
        public formation?: string,
        public campus?: string,
        public note_choix?: string,

        public documents?: {
            _id?: string,
            nom?: string,
            path?: string,
        }[],
        public _id?: string,
        public created_by?: User,
        public qualifications?:{
             criteres_qualification?: any,
             decision_qualification?: string,
             note_qualification?: string,
        }[],
        public equipe?: string,
    ) { }

}
