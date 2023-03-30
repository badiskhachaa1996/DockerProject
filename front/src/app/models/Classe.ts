export class Classe {
  constructor(
    public _id?: string,
    public diplome_id?: string,
    public campus_id?: string,
    //public nom?: string,
    public active?: boolean,
    public abbrv?: string,
    public annee?: string,
    public lien_programme?: string,
    public lien_calendrier?: string,
    public calendrier?: string, // document pdf lié au contrat
  ) { }

}
