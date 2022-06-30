export class Etudiant {
    constructor(
        public _id?: string,
        public user_id?: string,
        public classe_id?: string,
        public statut?: string,
        public nationalite?: string,
        public date_naissance?: Date,
        public code_partenaire?: string,
        public hasBeenBought?: boolean,
        public examenBought?: string,
        public howMuchBought?: number,
        public custom_id?: string,
        public numero_INE?: string,
        public numero_NIR?: string,
        public sos_email?: string,
        public sos_phone?: string,
        public nom_rl?: string,
        public prenom_rl?: string,
        public phone_rl?: string,
        public email_rl?: string,
        public adresse_rl?: string,
        public dernier_diplome?: string,
        public isAlternant?: boolean,
        public entreprise_id?: string,
        public nom_tuteur?: string,
        public prenom_tuteur?: string,
        public adresse_tuteur?: string,
        public email_tuteur?: string,
        public phone_tuteur?: string,
        public indicatif_tuteur?: string,
        public isHandicaped?: boolean,
        public suivi_handicaped?:string
    ) { }
}