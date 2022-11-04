export class Etudiant {
    constructor(
        public _id?: string,
        public user_id?: string,
        public classe_id?: string,
        public statut?: string, // Statut pro
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
        // public indicatif_tuteur?: string,
        public isHandicaped?: boolean,
        public suivi_handicaped?: string,
        public diplome?: string, // Pour les étudiants en reinscription NE PAS UTILISER DE ID
        public parcours?: any,
        public remarque?: string,
        public isOnStage?: boolean,
        public fileRight?: [],
        public payment_reinscrit?: [],
        public isActive?:boolean,
        public enic_naric?: boolean,
        public campus?: string, // Campus ID
        public statut_dossier?: string[],
        public filiere?: string,
        public valided_by_admin?: boolean,
        public valided_by_support?: boolean,
        public annee_scolaire?: string[],

    ) { }
}