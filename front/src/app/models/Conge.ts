import { User } from "./User";

export class Conge {
    constructor(
        public _id?: string,
        public user_id?: string,
        public date_demande?: Date,
        public type_conge?: string,
        public other_motif?: string,
        public date_debut?: Date,
        public date_fin?: Date,
        public nombre_jours?: number,
        public motif?: string,
        public justificatif?: string,
        public statut?: string,
        public note_decideur?: string,
        public valided_by?: User,
        public valided_date?: Date,
        public commented_by?: User,
        public commented_date?: Date,
        public urgent?: boolean

    ) { }
}