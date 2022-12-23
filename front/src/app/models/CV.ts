export class CV {
    constructor(
        public _id:             string,
        public user_id:         string,
        public langues?:        string[],
        public experiences?:    any[], 
        public connaissances?:  any[],
        public video_lien?:     string,
    ){}
}