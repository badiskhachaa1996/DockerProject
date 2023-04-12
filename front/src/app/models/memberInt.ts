import { TeamsInt } from "./teamsInt";
import { User } from "./User";

export class MemberInt {
    constructor(
        public user_id?: User,
        public team_id?: TeamsInt,
        public localisation?: string,
        public role?: string,
        public custom_id?: string,
        public date_creation?: Date,
        public _id?: string
    ) { }

}