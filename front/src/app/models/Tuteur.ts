import { Entreprise } from "./Entreprise";
import { User } from "./User";

export class Tuteur {
    constructor(
        public entreprise_id?: Entreprise,
        public user_id?:User,
        public fonction?: string,
        public anciennete?: string,
        public niveau_formation?: string
    ) { }

}