import { Prospect } from "./Prospect";
import { User } from "./User";

export class HistoriqueLead {
    constructor(
        public _id?: string,
        public lead_before?: Prospect,
        public lead_after?: Prospect,
        public lead_id?: Prospect,
        public user_id?: User,
        public detail?: string,
        public date_creation?: Date,
    ) { }
}