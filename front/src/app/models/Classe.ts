export class Classe {
    label(label: any, value: any) {
      throw new Error('Method not implemented.');
    }
    value(label: any, value: any) {
      throw new Error('Method not implemented.');
    }
    static _id: any;
    constructor(
        public _id?: string,
        public diplome_id?: string,
        public nom?: string,
        public active?: boolean,
        public abbrv?: string,
    ) { }

}
