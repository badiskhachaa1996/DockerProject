import { GenSchool } from "./GenSchool"
import { GenCampus } from "./GenCampus"
import { GenFormation } from "./GenFormation"
import { User } from "../User"
import { GenRentre } from "./GenRentre"

export class GenDoc {
    constructor(
        public _id?: string,
        public type_certif?: {
            label: string,
            value: string,
            title: string,
        },
        public school?: GenSchool,
        public rentre?: GenRentre,
        public campus?: GenCampus,
        public formation?: GenFormation,
        public alternance?: boolean,
        public civilite?: string,
        public student?: {
            full_name: string,
            birth_date: string,
            birth_place: string,
        },
        public amount_paid?: string,
        public paiement_method?: string,
        public check?: string,
        public bank?: string,
        public id_doc?: string,
        public date?: string,
        public place_created?: string,
        public created_on?: Date,
        public created_by?: User,
    ){};
}