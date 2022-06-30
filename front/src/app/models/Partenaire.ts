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
        public indicatifPhone?:string,
        public indicatifWhatsApp?:string
    ) { }
}