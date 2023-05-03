import { Partenaire } from "./Partenaire";

export class Brand {
    public constructor(
        public _id?: string,
        public nom?: string,
        public description?: string,
        public partenaire_id?: Partenaire,
        public haveLogo?: boolean
    ) { };
}