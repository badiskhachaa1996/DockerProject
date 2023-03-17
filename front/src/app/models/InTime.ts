export class InTime
{
    public constructor
    (
        public _id?:                            string,
        public user_id?:                        string,
        public in_ip_adress?:                   string,
        public out_ip_adress?:                  string,
        public date_of_the_day?:                string,
        public in_date?:                        Date,
        public out_date?:                       Date,
        public statut?:                         string,
        public isCheckable?:                    boolean,
        public craIsValidate?:                  boolean,
        // public principale_activity_details?:    any,
        public activity_details?:               string[],
        public number_of_hour?:                 number,
    ) {}
}