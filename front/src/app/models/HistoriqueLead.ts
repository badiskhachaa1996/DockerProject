import { Prospect } from "./Prospect";
import { User } from "./User";

export class HistoriqueLead {
    constructor(
        public _id?: string,
        public lead_before?: Prospect,
        public lead_after?: Prospect,
        public user_before?: Prospect,
        public user_after?: User,
        public lead_id?: User,
        public user_id?: User,
        public detail?: string,
        public date_creation?: Date,
    ) { }
}