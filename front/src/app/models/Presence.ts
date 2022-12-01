export class Presence {

    constructor(
        public _id?: string,
        public seance_id?: string,
        public user_id?: string,
        public isPresent?: boolean,
        public signature?: any,
        public justificatif?: boolean,
        public date_signature?: Date,
        public allowedByFormateur?: Boolean
    ) { }

}