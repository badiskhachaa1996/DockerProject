export class MailType {

    constructor(
        public _id?: string,
        public objet?: string,
        public custom_id?: string,
        public body?: string,
        public type?: string,
        public date_creation?: Date,
        public pieces_jointe?: [
            {
                date: Date,
                nom: string,
                path: string,
            }
        ]
    ) { }

}