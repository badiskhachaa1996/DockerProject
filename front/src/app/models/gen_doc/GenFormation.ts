import { GenRentre } from "./GenRentre"

export class GenFormation{
    constructor(
        public _id?: string,
        public name?: string,
        public rncp?: string,
        public niveau?: string,
        public accrediteur?: string,
        public duration?: string,
        public price?: string,
    ){};
}