import { Ecole } from "./Ecole";

export class CampusR {
    constructor(
        public _id?: string,
        public libelle?: string,
        public ecoles?: {
            ecole_id?: Ecole,
            email?: string
        }[],
        public salles?: string[]
    ) { }
}