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
        public directeur_id?: string,
        public entreprise_id?: string,
        public code_commercial?: string,
        public statut?: string,
        public anne_scolaire?: string[],
        public ecole?: string,
        public cout_mobilite?: number,
        public cerfa?: string, //* file
        public convention_formation?: string, //* file
        public resiliation_contrat?: string, //* file
        public accord_prise_charge?: string, //* file
    ) { }

}