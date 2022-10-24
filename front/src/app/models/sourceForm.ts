export class sourceForm{

    constructor(
        public _id?:                string,
        public prenom?:            string,
        public nom?:            string,
        public date_naissance?:             Date,
        public pays_naissance?:             string,
        public nationalite?:             string,
        public email?:             string,
        public phone?:             string,
        public domaine?:             string,
        public source?:             string,
        public etablissement?:             string,
        public inscrit_etablissement?:             Boolean
    ){}

}