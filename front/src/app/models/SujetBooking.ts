export class SujetBooking {
  constructor(
    public _id?: string,
    public titre_sujet?: string,
    public duree?: Date,
    public canal?: string[],
    public description?: string,
    public sujet_list?: any[],
    public active? : boolean,
    public membre?: any[],
  ) {}
}