export interface Ticket {
    id?:string;
    _id?:string;
    createur_id: string;
    sujet_id:string;
    date_ajout?:Date;
    agent_id?:string;
    statut?:string;
    date_affec_accep?:string;
    temp_traitement?:string;
    temp_fin?:string;
    isAffected?:boolean;
    description:string;
   
}
  