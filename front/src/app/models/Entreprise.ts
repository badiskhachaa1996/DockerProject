import { User } from "./User";

export class Entreprise {

    constructor(
        public _id?: string,
        public r_sociale?: string,
        public fm_juridique?: string,
        public activite?: string,
        public type_ent?: string,
        public categorie?: string,
        public isInterne?: Boolean,
        public crc?: string,
        public nb_salarie?: Number,
        public convention?: string,
        public idcc?: string,
        public indicatif_ent?: Number,
        public phone_ent?: Number,
        public adresse_ent?: string,
        public code_postale_ent?: Number,
        public ville_ent?: string,
        public adresse_ec?: string,
        public postal_ec?: Number,
        public ville_ec?: string,
        public siret?: Number,
        public code_ape_naf?: string,
        public num_tva?: string,
        public telecopie?: string,
        public OPCO?: string,
        public organisme_prevoyance?: string,
        public directeur_id?: string,
        public commercial_id?: string,
        public rcs?: string,
        public site_web?: string,
        public email?: string
    ) { }

} 