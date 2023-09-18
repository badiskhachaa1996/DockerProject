
import { CV } from "./CV";
import { User } from "./User";

export class MeetingTeams {
    constructor(
        public _id?: string,
        public winner_id?: User,
        public user_id?: User,
        public cv_id?: CV,
        public company_email?: string,
        public meeting_start_date?: Date,
        public date_creation?: Date,
        public description?: string,
        public statut?: string
    ) { }

}
