import { CampusR } from "./CampusRework";
import { EcoleAdmission } from "./EcoleAdmission";
import { FormationAdmission } from "./FormationAdmission";

export class Groupe {
    constructor(
        public _id?: string,
        public formation_id?: FormationAdmission,
        public campus_id?: CampusR,
        public ecole_id?: EcoleAdmission,
        public nom?: string,
        public active?: boolean,
        public abbrv?: string,
        public annee?: string,
        public lien_programme?: string,
        public lien_calendrier?: string,
        public calendrier?: string, // document pdf lié au contrat
    ) { }

}
