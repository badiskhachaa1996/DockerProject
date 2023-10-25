import { User } from "./User";

export class EventCalendarRH {
    public constructor(
        public _id?: string,
        public date?: Date,
        public type?: string,
        public note?: string,
        public created_by?: User,
        public name?:string,
        public campus?:string,
    ) { };
}