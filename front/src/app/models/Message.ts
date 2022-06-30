export class Message {
    constructor(
        public _id?:string,
        public document?:string,
        public documentType?:string,
        public description? : string,
        public user_id?:string,
        public ticket_id?:string,
        public isRep?:Boolean,
    ){}

 }
   