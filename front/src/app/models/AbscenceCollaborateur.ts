export class AbscenceCollaborateur{
    constructor(
        public _id?: string,
        public user_id?: string,
        public date_of_abscence?: string,
        public motif?: string,
        public periode?: string,
        public file_name?: string,
    ){};
}