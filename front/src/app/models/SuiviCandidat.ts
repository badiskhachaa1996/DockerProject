import { Annonce } from "./Annonce";
import { Entreprise } from "./Entreprise";
import { User } from "./User";

export class SuiviCandidat {
    constructor(
        public candidat_id?: User,
        public offre_id?: Annonce,
        public _id?: string,
        public statut?: string,
        public note?: string,
        public entreprise_id?: Entreprise
    ) { }
}
