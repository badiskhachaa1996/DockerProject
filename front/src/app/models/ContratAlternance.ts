import { Diplome } from "./Diplome";
import { User } from "./User";

export class ContratAlternance {
    constructor(
        public debut_contrat?: Date,
        public fin_contrat?: Date,
        public horaire?: String,
        public alternant_id?: User,
        public intitule?: String,
        public classification?: String,
        public niveau_formation?: String,
        public coeff_hierachique?: String,
        public formation?: Diplome,
        public tuteur_id?: User,
    ) { }

}