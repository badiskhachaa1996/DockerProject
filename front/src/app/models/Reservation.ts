export class Reservation
{
    public constructor(
        public _id?: string,
        public pWR?: string,    //personne qui à reservé
        public pFFR?: string,   //Personne colocataire
        public isValidate?: boolean, 
    ){}
}