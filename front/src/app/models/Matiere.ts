import { Diplome } from "./Diplome";

export class Matiere {

    constructor(
        public _id?: string,
        public nom?: string,
        public formation_id?: string,
        public volume_init?:number,
        public abbrv?: string,
        //public classe_id?:string,
        public seance_max?:number,
        public coeff?:number,
        public credit_ects?:number,
        public remarque?: string,
        public semestre?: String,
        public niveau?:String,
    ) { };

}