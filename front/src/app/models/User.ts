import { Annonce } from "./Annonce";
import { LeadCRM } from "./LeadCRM";
import { Matching } from "./Matching";
import { Prospect } from "./Prospect";
import { Service } from "./Service";
import { Ticket } from "./Ticket";

export class User {
    indicateur: any;
    constructor(
        public _id?: string,
        public firstname?: string,
        public lastname?: string,
        public indicatif?: string,
        public phone?: string,
        public email?: string,
        public email_perso?: string,
        public password?: string,
        public role?: string,
        public etat?: boolean,
        public service_id?: string,
        public civilite?: string,
        public pathImageProfil?: string,
        public typeImageProfil?: string,
        public type?: string,
        public entreprise?: string,
        public pays_adresse?: string,
        public ville_adresse?: string,
        public rue_adresse?: string,
        public numero_adresse?: string,
        public postal_adresse?: string,
        public nationnalite?: string,
        public verifedEmail?: boolean,
        public date_creation?: Date,
        public departement?: string,
        public mention?: string,
        public campus?: string,
        public roles_list?: {
            _id?: string,
            module?: string,
            role?: string,
        }[],
        public service_list?: any[],
        public statut?: string,
        public sujet_list?: any[],
        public roles_ticketing_list?: {
            _id?: string,
            module?: Service,
            role?: string,
        }[],
        public documents_rh?: {
            _id?: string,
            date?: Date,
            filename?: string,
            path?: string,
            note?: string
        }[],
        public savedTicket?: Ticket[],
        public savedAnnonces?: Annonce[],
        public savedMatching?: Matching[],
        public linksnames?: string[],
        public last_connection?: Date,
        public haveNewAccess?: Boolean,
        public type_supp?: string[],
        public savedAdministration?: Prospect[],
        public savedLeadCRM?: LeadCRM[]
    ) { }


}
