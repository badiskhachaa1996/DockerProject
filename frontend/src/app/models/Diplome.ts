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
        public duree?:          number,
        public date_debut?:     Date,
        public date_fin?:       Date,
        public rythme?:         string,
        public frais?:          number,
        public frais_en_ligne?: number
    ){}

}