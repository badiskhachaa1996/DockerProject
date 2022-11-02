export class InTime
{
    public constructor
    (
        public _id?: string,
        public ip_adress?: string,
        public date_of_the_day?: string,
        public in_date?: Date,
        public out_date?: Date,
        public in_location?: string,
        public out_location?: string,
        public statut?: string,
        public ip_ref?: string,
    ) {}
}