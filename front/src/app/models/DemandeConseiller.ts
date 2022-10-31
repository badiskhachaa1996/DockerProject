import { User } from "./User";

export class DemandeConseiller {
    constructor(
        public _id?: string,
        public student_id?:User,
        public conseiller_id?:User,
        public archived?:Boolean,
        public activated?:Boolean
        )
        {}

 }
   