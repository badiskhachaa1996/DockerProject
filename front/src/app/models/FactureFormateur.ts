import { Formateur } from "./Formateur";
import { Seance } from "./Seance";

export class FactureFormateur {

    constructor(
        public _id?: string,
        public formateur_id?: string | Formateur,
        public seance_id?: string | Seance,
        public date_creation? : Date
    ) { };

}