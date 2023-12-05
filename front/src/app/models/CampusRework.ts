import { Ecole } from "./Ecole";
import { EcoleAdmission } from "./EcoleAdmission";

export class CampusR {
    constructor(
        public _id?: string,
        public libelle?: string,
        public ecoles?: {
            ecole_id?: EcoleAdmission
            email?: string
        }[],
        public salles?: string[]
    ) { }
}