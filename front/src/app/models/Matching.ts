import { Annonce } from "./Annonce";
import { CV } from "./CV";
import { User } from "./User";

export class Matching {
    constructor(
        public _id?: string,
        public offre_id?: Annonce,
        public matcher_id?: User,
        public cv_id?: CV,
        public statut?: string,
        public type_matching?: string,
        public date_creation?: Date,
        public remarque?: string,
        public taux?: number,
        public hide?: boolean,
        public accepted?: boolean,
        public favoris?: boolean
    ) { }

}
