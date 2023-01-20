export class Project{
    constructor
    (
        public _id?:            string,
        public libelle?:        string,
        public percent?:        number,
        public created_at?:     Date,
        public creator_id?:     string,
    ){}
}