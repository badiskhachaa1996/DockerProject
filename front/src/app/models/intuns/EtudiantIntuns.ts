import { User } from "../User";
import { FormationsIntuns } from "./formationsIntuns";

export class EtudiantIntuns {
    constructor(
        public _id?: string,
        public user_id?: User,
        public formation_id?: FormationsIntuns,
    ) { }

}
