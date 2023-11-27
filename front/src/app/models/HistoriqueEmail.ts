import { Prospect } from "./Prospect";
import { User } from "./User";

export class HistoriqueEmail {

    constructor(
        public _id?: string,
        public objet?: string,
        public body?: string,
        public send_to?: any,
        public send_by?: User,
        public send_from?: string,
        public date_creation?: Date,
        public cc?: string[]
    ) { }

}