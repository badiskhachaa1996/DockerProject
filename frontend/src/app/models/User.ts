export class User {
    constructor(
        public _id?: string,
        public firstname?:string,
        public lastname?: string,
        public phone?:string,
        public email?:string,
        public password?:string,
        public role?:string,
        public etat?: boolean,
        public adresse?:string,
        public service_id?:string,
        public civilite?:string
    ){}
    

}
  