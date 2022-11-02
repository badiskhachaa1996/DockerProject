import { User } from "./User";

export class teamCommercial {

    constructor(
        public _id?: string,
        public createur_id?: User,
        public owner_id?: User,
        public team_id?: [User],
    ) { }
}