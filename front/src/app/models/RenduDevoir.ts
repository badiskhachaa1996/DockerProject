export class RenduDevoir {

    constructor(
        public _id?: string,
        public description?: string,
        public devoir_id?: string,
        public etudiant_id?: string,
        public date_rendu?: Date,
        public haveFiles?: Number,
        public verified?: Boolean
    ) { }

}