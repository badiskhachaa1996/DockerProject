import { User } from "./User";

export class Dashboard {
    constructor(
        public _id?: string,
        public user_id?:User,
        public links?:any[],
        )
        {}

}