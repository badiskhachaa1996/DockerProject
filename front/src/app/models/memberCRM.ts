import { TeamsCRM } from "./TeamsCRM";
import { User } from "./User";

export class MemberCRM {
    constructor(
        public user_id?: User,
        public team_id?: TeamsCRM,
        public localisation?: string,
        public role?: string,
        public custom_id?: string,
        public date_creation?: Date,
        public numero_whatapp?: string,
        public _id?: string
    ) { }

}