import { EcoleAdmission } from "./EcoleAdmission";

export class RentreeAdmission {

    constructor(
        public _id?: string,
        public nom?: string,
        public date_debut_inscription?: Date,
        public date_fin_inscription?: Date,
        public date_commencement?: Date,
        public ecoles?: EcoleAdmission[]

    ) { }

}