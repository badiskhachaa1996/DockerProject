import { User } from "./User";

export class ExterneSkillsnet {

    constructor(
        public _id?: string,
        public user_id?: User,
        public created_by?: User,
        public created_at?: Date,
        public date_naissance?: Date
    ) { };

}