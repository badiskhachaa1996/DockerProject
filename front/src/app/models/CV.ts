export class CV {
    constructor(
        public _id?:                string,
        public user_id?:            string,
        public experiences_pro?:    string[], 
        public experiences_sco?:    string[], 
        public competences?:        string[],
        public outils?:             string[],
        public langues?:            string[],
        public video_lien?:         string,
        public filename?:           string
    ){}
}