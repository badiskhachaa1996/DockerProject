export class Notification {
    constructor(
    public _id?:string,
    public ticket_id?:string,
    public etat?:boolean,
    public type?:string,
    public date_ajout?:Date,
    public user_id?:string
    ){}
}