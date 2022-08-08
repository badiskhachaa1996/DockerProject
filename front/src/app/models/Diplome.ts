export class Diplome{

    constructor(
        public _id?:            string,
        public titre?:          string,
        public titre_long?:     string,
        public campus_id?:      string,
        public description?:    string,
        public type_diplome?:   string,
        public type_etude?:     string,
        public domaine?:        string,
        public niveau?:         string,
        public certificateur?:  string,
        public code_RNCP?:      string,
        public nb_heure?:       number,
        public date_debut?:     Date,
        public date_fin?:       Date,
        public rythme?:         string,
        public frais?:          number,
        public frais_en_ligne?: number,
        public isCertified?: boolean,
        public date_debut_examen?: Date,
        public date_fin_examen?: Date,
        public date_debut_stage?: Date,
        public date_fin_stage?: Date,
        public date_debut_semestre_1?: Date,
        public date_fin_semestre_1?: Date,
        public date_debut_semestre_2?: Date,
        public date_fin_semestre_2?: Date,
        public code_diplome?: string,
        public imgNames?:[string],
        public imgTypes?:[string],
        public formateur_id?:string
    ){}

}