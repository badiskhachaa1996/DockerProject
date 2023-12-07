export class Budget {
    constructor
    (
        public _id?: string,
        public libelle?: string,
        public charge?: number,
        public depense?: number,
        public project_id?: string,
        public documents?: {
            _id?: string,
            nom?: string,
            path?: string,
        }[],
    ){}
}
