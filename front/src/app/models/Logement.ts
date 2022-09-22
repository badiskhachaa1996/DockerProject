export class Logement
{
    public constructor
    (
        public _id?: string,
        public localite?: string,
        public image?: string,
        public surface?: number,
        public pieces?: number,
        public type?: string,
        public capacite?: number,
        public description?: string,
        public prix?: {
            loyer?: number,
            charge?: number, 
            caution?: number,
            frais?: number,
        },
        public caracteristiques?: {
            ascensseur?: number,
            cuisine?: number,
            interphone?: number,
            type_chauffage?: string,
            disponibilite?: Date,
        }
    ){};
} 