export class FormulaireICBS {

    constructor(
        public _id?: string,
        public age?: number,
        public phone?: {
            countryCode: string,
            dialCode: string,
            e164Number: string,
            internationalNumber: string,
            nationalNumber: string,
            number: string,
        },
        public email?: string,
        public occupation?: string,
        public field?: string,
        public langue?: string,
        public date_creation?: Date
    ) { }

}