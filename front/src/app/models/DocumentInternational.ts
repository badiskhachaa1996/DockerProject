import { EcoleAdmission } from "./EcoleAdmission";
import { Prospect } from "./Prospect";
import { User } from "./User";

export class DocumentInternational {

    constructor(
        public _id?: string,
        public custom_id?: string,
        public prospect_id?: Prospect,
        public ecole?: EcoleAdmission,
        public type?: string,
        public date?: Date,
        public user_id?: User,
        public filename?: string,
    ) { }

}