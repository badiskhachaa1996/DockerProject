export class CV {
    constructor(
        public _id: string,
        public user_id: string,
        public langues?: string[],
        public experiences?: [
            { skill: String, date_debut: Date, date_fin: Date }
        ], public connaissances?: [
            { skill: String, niveau: String }
        ]
    ) { }

}