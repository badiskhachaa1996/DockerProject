import { User } from "./User";

export class DisponibiliteEtudiant {

    constructor(
        public _id?: string,
        public libelle?: string,
        public type?: string,
        public user_id?: User,
        public to?: Date,
        public from?: Date,
    ) { }

}