import { Entreprise } from "./Entreprise";
import { User } from "./User";

export class Tuteur {
    constructor(
        public entreprise_id?: string,
        public user_id?: User,
        public fonction?: string,
        public anciennete?: string,
        public niveau_formation?: string,
        public date_naissance?: Date,
        public role?: string,
        public _id?: string
    ) { }

}