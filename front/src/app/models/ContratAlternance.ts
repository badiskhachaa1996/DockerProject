import { Diplome } from "./Diplome";
import { Etudiant } from "./Etudiant";
import { Tuteur } from "./Tuteur";
import { User } from "./User";

export class ContratAlternance {
    constructor(
        public _id: string,
        public debut_contrat?: Date,
        public fin_contrat?: Date,
        public horaire?: String,
        public alternant_id?: string,
        public intitule?: String,
        public classification?: String,
        public niveau_formation?: String,
        public coeff_hierachique?: String,
        public formation?: Diplome,
        public tuteur_id?: Tuteur,
        public code_commercial?: string,
        public statut?: string,
        public anne_scolaire?: string[],
    ) { }

}