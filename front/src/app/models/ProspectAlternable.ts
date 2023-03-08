export class ProspectAlternable {
    constructor(
        public _id?:                    string,
        public user_id?:                string,
        public date_naissance?:         Date,
        public nir?:                    string,
        public commune_naissance?:      string,
        public isHandicap?:             boolean,
        public last_title_prepared?:    string,
        public title_in_progress?:      string,
        public highest_title?:          string,
        public commercial_id?:          string,
    ){}
}