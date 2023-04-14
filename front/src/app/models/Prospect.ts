export class Prospect {

    constructor(
        public _id?: string,
        public user_id?: string,
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
        public donneePerso?: string,
        public date_creation?: string,
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
        public validated_cf?: boolean,
        public payement?: any[],
        public avancement_visa?: boolean,
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
    ) { }

}