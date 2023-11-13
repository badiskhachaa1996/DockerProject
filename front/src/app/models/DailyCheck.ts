import { User } from "./User";

export class DailyCheck {
    public constructor
        (
            public _id?: string,
            public user_id?: any,
            public today?: string,
            public check_in?: Date,
            public pause?: { in?: Date, out?: Date, motif?: string }[],
            public isInPause?: boolean,
            public cra?: any[],
            public is_anticipated?: boolean,
            public check_out?: Date,
            public taux_cra?: any,
            public pause_timing?: number,
            public validated?: boolean,
            public commentaire?: string,
            public commented_by?: User,
            public commented_date?: Date,
            public platform_out?: string,
            public platform_in?: string,
            public localisation_out?: string,
            public localisation_in?: string,
            public auto?: boolean
        ) { }
}