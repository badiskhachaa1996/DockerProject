import { Formateur } from "./Formateur";
import { Seance } from "./Seance";

export class FactureFormateur {

    constructor(
        public _id?: string,
        public formateur_id?: any,
        public seance_id?: any,
        public date_creation?: Date
    ) { };

}