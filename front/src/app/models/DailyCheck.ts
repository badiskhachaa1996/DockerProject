export class DailyCheck
{
    public constructor
    (
        public _id?:            string,
        public user_id?:        any,
        public today?:          string,
        public check_in?:       Date,
        public pause?:          any[],
        public isInPause?:      boolean,
        public cra?:            any[],
        public is_anticipated?: boolean,
        public check_out?:      Date,
        public taux_cra?:       string,
        public pause_timing?:   number,
    ){}
}