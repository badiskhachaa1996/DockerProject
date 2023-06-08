export class Conge{
    constructor(
        public _id?: string,
        public user_id?: string,
        public date_demande?: Date,
        public type_conge?: string,
        public date_debut?: Date,
        public date_fin?: Date,
        public motif?: string,
        public justificatif?: string,
        public note?: string,
        public statut?: string,
        public note_decideur?: string,
    ){}
}