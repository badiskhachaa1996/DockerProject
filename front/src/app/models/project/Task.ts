export class Task{
    constructor
    (
        public _id?:            string,
        public libelle?:        string,
        public percent?:        number,
        public attribuate_to?:  string[],
        public project_id?:     string,
        public number_of_days?: number,
        public created_at?:     Date,
    ){}
}