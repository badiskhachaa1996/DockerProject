export class Task{
    constructor
    (
        public _id?:            string,
        public ticketId?:      any[],
        public libelle?:        string,
        public description_task?:    string,
        public attribuate_to?:  any[],
        public project_id?:     any,
        public number_of_hour?:  number,
        public avancement?:      number,
        public date_limite?:    Date,
        public etat?:           string,
        public priorite?:       string,
        public consignes?: any[],
        public validation?: string,
        public identifian?: string,
        public urgent?: boolean,
        public documents?: {
            _id?: string,
            nom?: string,
            path?: string,
        }[],
    ){}
}