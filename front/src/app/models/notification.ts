export class Notification {
    constructor(
        public _id?: string,
        public info_id?: string, //info_id
        public etat?: boolean, //etat
        public type?: string, //Infos ex: "Nouveau Ticket"
        public date_ajout?: Date,
        public user_id?: string, //peut être vide (à qui est lié le ticket)
        public service_id?:string
    ) { }
}