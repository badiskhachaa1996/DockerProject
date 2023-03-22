export class Partenaire {

    constructor(
        public _id?: string,
        public user_id?: string,
        public code_partenaire?: string,
        public nom?: string,
        public phone?: string,
        public email?: string,
        public number_TVA?: string,
        public SIREN?: string,
        public SIRET?: string,
        public format_juridique?: string,
        public type?: string,
        public APE?: string,
        public Services?: string,
        public Pays?: string,
        public WhatsApp?: string,
        public indicatifPhone?: string,
        public indicatifWhatsapp?: string,
        public site_web?: string,
        public facebook?: string,
        public description?: string,
        public date_creation?: Date,
        public statut_anciennete?: string,
        public contribution?: string,
        public etat_contrat?: string,
    ) { }
}