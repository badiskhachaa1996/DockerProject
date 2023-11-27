export class Evaluation {
    constructor(
        public _id?: string,
        public label?: string,
        public lien?: string,
        public duree?: string,
        public score?: string,
        public Condition_admission?: string,
        public description?: string,
        public etat?: string,
        public resultats?: {
            user_id: any,
            note?: number,
            date_passation: Date,
            duree_mise: Number,
        }[]
    ) { }
}