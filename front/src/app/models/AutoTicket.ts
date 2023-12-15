import { Service } from "./Service";
import { Sujet } from "./Sujet";
import { User } from "./User";

export class AutoTicket {
    public constructor(
        public _id?: string,
        public custom_id?: string,
        public created_date?: Date,
        public created_by?: User,
        public assigned_to?: User,
        public type_auto?: string,

        //EX Ticket:
        public sujet_id?: Sujet,
        public filiere?: string,
        public site?: string,
        public type?: string,
        public demande?: string,
        public module?: string,
        public campus?: string,
        //FIN EX
    ) { };
}