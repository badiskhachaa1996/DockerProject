import { Prospect } from "./Prospect";

export class CandidatureLead {
    public constructor(
        public nom?: string,
        public prenom?: string,
        public date_naissance?: Date,
        public nationalite?: string,
        public email?: string,
        public adresse?: string,
        public lead_id?: Prospect,
        public isPMR?: Boolean,
        public PMRneedHelp?: Boolean,
        public qualites?: string,
        public toWorkOn?: string,
        public skills?: string,
        public parcours?: string,
        public experiences?: string,
        public courtterme3?: string,
        public courtterme5?: string,
        public courtterme10?: string,
        public formation?: string,
        public campus?: string,
        public rentrée_scolaire?: string,
        public niveau?: string,
        public suivicours?: Boolean,
        public acceptRythme?: Boolean,
        public besoins?: string,
        public motivations?: number,
        public attentes?: string,
        public niveau_actuel?: number,
        public competences_digitales?: number,
        public competences_teams?: number,
        public competences_solo?: number,
        public signature?: string,
        public date_creation?: Date
    ) { };
}