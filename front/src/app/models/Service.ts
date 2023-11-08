export class Service {
   constructor(
      public label?: string,
      public _id?: string,
      public active?: boolean,
      public index?: number,
      public extra1?: string[],
      public extra2?: string[],
      public extraInfo?: {
         title1?: string,
         title2?: string,
         placeholder1?: string,
         placeholder2?: string
      }
   ) { }

}