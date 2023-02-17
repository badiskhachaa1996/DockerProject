export class Ticket {

    constructor(
        public _id?: string,
        public createur_id?: string,
        public sujet_id?: string,
        public date_ajout?: Date,
        public agent_id?: string,
        public statut?: string,
        public date_affec_accep?: Date,
        public temp_traitement?: string,
        public date_fin_traitement?: Date,
        public isAffected?: boolean,
        public description?: string,
        public isReverted?: boolean,
        public justificatif?: string,
        public date_revert?: Date,
        public user_revert?: string,
        public customid?: string,
        public etudiant_id?: string
    ) { }


}