export class FormationAdmission {

    constructor(
        public _id?: string,
        public nom?: string,
        public niveau?: string,
        public rncp?: string,
        public certificateur?: string,
        public duree?: string,
        public description?: string,
        public criteres?: string,
        public tarif?: string,
        public langue?: string,
        public deroulement?: string,
        public filiere?: string,
        public bac?: string,
        public code?: string,
        public annee?: string,
        public code_france_competence?: string,
        public validite?: string,
        public organisme_referent?: string,
    ) { }

}