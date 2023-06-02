export class DailyCheck
{
    public constructor
    (
        public _id?: string,
        public user_id?: string,
        public today?: Date,
        public check_in?: number,
        public pause?: any[],
        public cra?: any[],
        public is_anticipated?: boolean,
        public check_out?: number,
    ){}
}