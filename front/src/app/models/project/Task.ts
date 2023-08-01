export class Task{
    constructor
    (
        public _id?:            string,
        public ticket_id?:      string,
        public libelle?:        string,
        public description_task?:    string,
        public attribuate_to?:  string[],
        public project_id?:     string,
        public number_of_hour?:  number,
        public date_limite?:    Date,
        public etat?:           string,
        public priorite?:       string,
    ){}
}