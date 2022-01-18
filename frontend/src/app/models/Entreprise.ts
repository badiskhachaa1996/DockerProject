export class Entreprise {

    constructor(
        public _id?: string,
        public r_sociale?: string,
        public fm_juridique?: string,
        public vip?: string,
        public type_ent?: string,
        public isInterne?: boolean,
        public siret?: string,
        public code_ape_naf?: string,
        public num_tva?: string,
        public nom_contact?: string,
        public prenom_contact?: string,
        public fc_contact?: string,
        public email_contact?: string,
        public phone_contact?: string,
        public nom_contact_2nd?: string,
        public prenom_contact_2nd?: string,
        public fc_contact_2nd?: string,
        public email_contact_2nd?: string,
        public phone_contact_2nd?: string,
        public pays_adresse?: string,
        public ville_adresse?: string,
        public rue_adresse?: string,
        public numero_adresse?: number,
        public postal_adresse?: string,
        public email?: string,
        public phone?: string,
        public website?: string,
        public financeur?: string,
    ){}

}