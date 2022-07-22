export class Notification {
    constructor(
    public _id?:string,
    public ticket_id?:string, //info_id
    public etat?:boolean, //etat
    public type?:string, //Infos ex: "Nouveau Ticket"
    public date_ajout?:Date, 
    public user_id?:string //peut être vide (à qui est lié le ticket)
    // Service
    ){}
}
