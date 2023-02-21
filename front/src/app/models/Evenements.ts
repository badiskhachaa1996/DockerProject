import { User } from "./User";

export class Evenements {
    constructor(
        public _id?: string,
        public type?: string,
        public date_creation?: Date,
        public created_by?: User,
        public description?: string,
        public list_inscrit?: User,
        public date_lieu?: Date
    ) { }

}
