export class Annonce {
    constructor(
        public is_interne?: boolean,
        public _id?: string,
        public user_id?: any,
        public missionType?: string,
        public debut?: Date,
        public missionName?: string,
        public missionDesc?: string,
        public entreprise_id?: any,
        public entreprise_name?: string,
        public entreprise_ville?: string,
        public entreprise_mail?: string,
        public entreprise_phone_indicatif?: string,
        public entreprise_phone?: string,
        public profil?: any,
        public competences?: any[],
        public outils?: string[],
        public workplaceType?: string,
        public publicationDate?: Date,
        public source?: string,
        public isClosed?: boolean,
        public custom_id?: string,
        public date_creation?: Date,
        public statut?: string,
        public modified_at?: Date,
        public archived?: boolean
    ) { }
}