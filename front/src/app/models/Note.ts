export class Note {

    constructor(
        public _id?: string,
        public note_val?: string,
        public semestre?: string,
        public etudiant_id?: string,
        public examen_id?: string,
        public appreciation?: string,
        public classe_id?: string,
        public matiere_id?: string,
        public isAbsent?: boolean
    ) { };

}