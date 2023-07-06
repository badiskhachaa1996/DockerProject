import { Mail } from "./Mail";
import { MailType } from "./MailType";

export class MailAuto {

    constructor(
        public _id?: string,
        public condition?: string,
        public custom_id?: string,
        public mailType?: MailType,
        public mail?: Mail,
        public etat?: string,
        public date_creation?: Date,
    ) { }

}