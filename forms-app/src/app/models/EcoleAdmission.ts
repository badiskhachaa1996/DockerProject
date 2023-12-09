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
        public campus?: string[],
        public langue?: string,
        public NDA?: string,
        public campusinfo?:[ {
            campus: string,
            adresse?: string,
            UAI?: string,
        }],
    ) { }

}