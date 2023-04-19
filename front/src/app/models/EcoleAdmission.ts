import { FormationAdmission } from "./FormationAdmission";

export class EcoleAdmission {

    constructor(
        public _id?: string,
        public titre?: string,
        public adresse?: string,
        public email?: string,
        public site_web?: string,
        public url_form?: string,
        public formations?: FormationAdmission[],
    ) { }

}