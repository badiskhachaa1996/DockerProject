export class Collaborateur
{
    public constructor(
        public _id?: string,
        public user_id?: string,
        public matricule?: string,
        public date_demarrage?: string,
        public date_naissance?: string,
        public localisation?: string,
        public intitule_poste?: string,
        public anciennete?: number,
        public contrat_type?: string,
        public statut?: string,
        public h_cra?: number,
        public competences?: any[],
        public poste_description?: string,
        public documents?: any[],
    ){}
}