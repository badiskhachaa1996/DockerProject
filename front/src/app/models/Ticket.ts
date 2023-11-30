import { User } from "./User";

export class Ticket {

    constructor(
        public _id?: string,
        public createur_id?: any,
        public sujet_id?: any,
        public date_ajout?: Date,
        public agent_id?: any,
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
        public etudiant_id?: any,
        public documents?: {
            _id?: string,
            nom?: string,
            path?: string,
        }[],
        public priorite?: boolean,
        public note?: string,
        public documents_service?: {
            _id?: string,
            nom?: string,
            path?: string,
            by?: any
        }[],
        public task_id?: any,
        public consignes?: any[],
        public avancement?: number,
        public validation?: string,
        public module?: string,
        public resum?: string,
        public type?: string,
        public origin?: string,
        public assigne_by?: User,
        public demande?: string,
        public campus?: string,
        public filiere?: string,
        public site?: string,
    ) { }



}