export class Tache{
    constructor
    (
        public _id?:            string,
        public libelle?:        string,
        public percent?:        number,
        public attribuate_to?:  string[],
        public project_id?:     string,
        public date_limite?:    Date,
        public created_at?:     Date,
        public creator_id?:     String,
    ){}
}