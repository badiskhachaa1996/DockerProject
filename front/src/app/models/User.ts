export class User {
    indicateur: any;
    constructor(
        public _id?: string,
        public firstname?: string,
        public lastname?: string,
        public indicatif?: string,
        public phone?: string,
        public email?: string,
        public email_perso?: string,
        public password?: string,
        public role?: string,
        public etat?: boolean,
        public service_id?: string,
        public civilite?: string,
        public pathImageProfil?: string,
        public typeImageProfil?: string,
        public type?: string,
        public entreprise?: string,
        public pays_adresse?: string,
        public ville_adresse?: string,
        public rue_adresse?: string,
        public numero_adresse?: string,
        public postal_adresse?: string,
        public nationnalite?: string,
        public verifedEmail?: boolean,
        public date_creation?: Date,
        public departement?: string,
        public mention?: string,
        public campus?: string,
        public roles_list?: {
            _id?: string,
            module?: string,
            role?: string,
        }[],
        public service_list?: any[],
        public statut?: string,
        public sujet_list?: any[],
    ) { }


}
