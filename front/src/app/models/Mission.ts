export class Mission {
    constructor(
        public _id?:                string,
        public type?:               string,
        public debut?:              Date,
        public missionName?:        string,
        public missionDesc?:        string,
        public location?:           string,
        public entreprise_id?:      string,
        public isClosed?:           boolean,
    ){}
}