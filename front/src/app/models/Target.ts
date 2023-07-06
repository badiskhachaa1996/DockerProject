import { TeamsCRM } from "./TeamsCRM";
import { MemberCRM } from "./memberCRM";

export class Target {

    constructor
        (
            public _id?: string,
            public equipe_id?: TeamsCRM,
            public member_id?: MemberCRM,
            public type?: string,
            public KPI?: number,
            public date_commencement?: Date,
            public deadline?: Date,
            public description?: string,
            public date_creation?: Date,
            public custom_id?: string,
        ) { }
}