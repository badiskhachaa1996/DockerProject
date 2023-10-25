import { User } from "./User"

export class Collaborateur {
    public constructor(
        public _id?: string,
        public user_id?: User,
        public matricule?: string,
        public date_demarrage?: string,
        public date_naissance?: Date,
        public localisation?: string[],
        public intitule_poste?: string,
        public contrat_type?: string,
        public statut?: string,
        public h_cra?: number,
        public competences?: {
            _id?: string,
            kind?: string,
            level?: string,
        }[],
        public poste_description?: string,
        public documents?: {
            title?: string,
            notes?: string
            filename?: string
        }[],
        public conge_nb?: number,
        public other?: {
            _id?: string,
            title?: string,
            description?: string,
        }[],
        public plafond?: number
    ) { }
}