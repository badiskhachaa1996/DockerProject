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
        public cout_mobilite_status?: string,
        public cout_mobilite?: number,
        public cout_mat_ped_status?: string,
        public cout_mat_ped?: number,
        public cout_dl_help_status?: string,
        public cout_dl_help?: number,
        public cerfa?: string, //* file
        public convention_formation?: string, //* file
        public resiliation_contrat?: string, //* file
        public accord_prise_charge?: string, //* file
        public relance?: string, //* file
        public last_status_change_date?: Date,
        public remarque?: string, // remarque faite de la part de l'entreprise
        public livret_apprentissage?: string, // *file
        public add_by?: string,
    ) { }
}