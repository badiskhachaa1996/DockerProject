import { DateSejourMI } from "./DateSejourMI";
import { DestinationMI } from "./DestinationMI";


export class FormulaireMI {

    constructor(
        public _id?: string,
        public name?: string,
        public date_naissance?: Date,
        public telephone?: {
            countryCode: string,
            dialCode: string,
            e164Number: string,
            internationalNumber: string,
            nationalNumber: string,
            number: string,
        },
        public mail?: string,
        public ecole?: string,
        public domaine?: string,
        public destination?: DestinationMI,
        public dateSejour?: DateSejourMI,
        public avantage?: string
    ) { }

}