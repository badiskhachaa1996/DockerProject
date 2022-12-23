export class Annonce {
    constructor(
        public _id?:                string,
        public user_id?:            string,
        public missionType?:        string,
        public debut?:              Date,
        public missionName?:        string,
        public missionDesc?:        string,
        public entreprise_name?:    string,
        public entreprise_ville?:   string,
        public entreprise_mail?:    string,
        public entreprise_phone_indicatif?: string,
        public entreprise_phone?:   string,
        public profil?:             string,
        public competences?:        string[],
        public workplaceType?:      string,
        public publicationDate?:    Date,
        public source?:             string,
        public isClosed?:           boolean,
    ){}
}