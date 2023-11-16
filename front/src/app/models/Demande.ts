 

export class Demande {

    constructor(

        public _id?: string,

        public student?: {

            civility?: string,
            last_name?: string,
            first_name?: string,
            date_naissance?: Date,
            nationality?: String,
            country_residence?: String ,
            phone?: string,
            indicatif_phone:String,
            email?: string,
        },

        public payment?: {
            note?: string,
            montant?: string,
            method?: string,
            date?: Date,
        },

        public training?: {

            name?: string,
            scholar_year?: Date,
            school?: string,
        },
        public refund?: {
            method?: string,
            date?: Date,
            date_estimated?: Date,
            montant?: number,
            note?: string,
        },
        public motif?: string,
        public status?: string,
        public comments?: 
            [{
                note?: string, 
                created_by?: string,
                created_on?: Date,
            }],
        public docs?: {
            
            rib: {
                nom?: string;
                added_on?: Date;
                added_by?: string;
                doc_number?: string;
            },
            attestation_payement: {
                nom?: string;
                added_on?: Date;
                added_by?: string;
                doc_number?: string;
            },
            preuve_payement: {
                nom?: string;
                added_on?: Date;
                added_by?: string;
                doc_number?: string; 
            },
            document_inscription: {
                nom?: string;
                added_on?: Date;
                added_by?: string;
                doc_number?: string;
            },
            autres_doc: {
                nom?: string;
                added_on?: Date;
                added_by?: string;
                doc_number?: string;
            }
        },
        public rejection_date?:Date,
        public created_on?: Date,
        public created_by?: string,
        public customid?:string,

    ){};

}