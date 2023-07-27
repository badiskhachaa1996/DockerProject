export class Project{
    constructor(
        public _id?:          string,
        public titre?:        string,  
        public createur_id?:  string,
        public createur? :    string,
        public created_date?: Date  ,               
        public debut?:        Date ,          
        public fin?:          Date  ,      
        public description?:  string,  
        public creator_id?:   string,         
        public responsable?:  string,              
        public etat?:         string,               
        public avancement?:   Number,              
    
      
    ){}
}