import { User } from "./User"

export class CV {
    constructor(
        public _id?: string,
        public user_id?: string,
        public experiences_pro?: {

            date_debut: Date,

            date_fin: Date,

            intitule_experience: string,

            structure: string,

            details: string,

            type: string

        }[],
        public competences?: string[],
        public outils?: string[],
        public langues?: string[],
        public video_lien?: string,
        public filename?: string,
        public education?: {

            date_debut: Date,

            date_fin: Date,

            intitule_experience: string,

            structure: string,

            details: string,

            type: string

        }[],
        public experiences_associatif?: {

            date_debut: Date,

            date_fin: Date,

            intitule_experience: string,

            structure: string,

            details: string,

            type: string

        }[],
        public informatique?: {

            date_debut: Date,

            date_fin: Date,

            intitule_experience: string,

            structure: string,

            details: string,

            type: string

        }[],
        public mobilite_lieu?: string,
        public mobilite_autre?: string,
        public date_creation?: Date,
        public centre_interets?: string,
        public a_propos?: string,
        public disponibilite?: Date,
        public createur_id?: User,
    ) { }
}