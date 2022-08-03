import { Entreprise } from "./Entreprise";

export class Tuteur {
    constructor(
        public entreprise_id?: Entreprise,
        public fonction?: string,
        public anciennete?: string,
        public niveau_formation?: string
    ) { }

}