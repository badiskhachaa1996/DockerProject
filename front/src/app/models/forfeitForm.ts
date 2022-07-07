export class ForfeitForm {

    constructor(
        public _id?: string,
        public date_naissance?: Date,
        public numero_whatsapp?: string,
        public validated_academic_level?: string,
        public statut_actuel?: string,
        public other?: string,
        public languages?: string,
        public professional_experience?: string,
        public campus_choix_1?: string,
        public campus_choix_2?: string,
        public campus_choix_3?: string,
        public programme?: string,
        public formation?: string,
        public rythme_formation?: string,
        public servicesEh?: Boolean[],
        public nomGarant?: string,
        public prenomGarant?: string,
        public nomAgence?: string,
        public donneePerso?: string,
        public date_creation?: Date,
        public type_form?: string,
        public code_commercial?: string,
        public indicatif_whatsapp?:string,
        public step?:number,
        public firstname?:string,
        public lastname?:string,
        public indicatif?:string,
        public phone?:string,
        public email_perso?:string,
        public civilite?:string,
        public pays_adresse?:string,
        public nationnalite?:string,
    ) { }

}