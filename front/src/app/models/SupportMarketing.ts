import { Brand } from "./Brand";

export class SupportMarketing {
    public constructor(
        public _id?: string,
        public nom?: string,
        public description?: string,
        public brand_id?: Brand,
        public date_creation?: Date,
        public haveFile?: Boolean
    ) { };
}