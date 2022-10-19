export class Mission {
    constructor(
        public _id?:                string,
        public user_id?:            string,
        public missionType?:        string,
        public debut?:              Date,
        public missionName?:        string,
        public missionDesc?:        string,
        public entreprise_id?:      string,
        public profil?:             string,
        public competences?:        string[],
        public workplaceType?:      string,
        public publicationDate?:    Date,
        public isClosed?:           boolean,
    ){}
}