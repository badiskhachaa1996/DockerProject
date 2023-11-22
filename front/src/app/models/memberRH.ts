import { TeamsInt } from "./TeamsInt";
import { User } from "./User";

export class MemberRH {
    constructor(
        public user_id?: User,
        public team_id?: TeamsInt,
        public role?: string,
        public _id?: string
    ) { }

}