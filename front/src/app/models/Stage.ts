export class Stage {
    constructor(
        public _id? :                   string,
        public student_id? :            string,
        public enterprise_id? :         string,
        public tutor_id? :              string,
        public director_id? :           string,
        public begin_date? :            Date,
        public end_date? :              Date,
        public schedules_per_week? :    number,
        public commercial_id? :         string,
        public mission_tasks?:          string,
        public gratification?:          number,
        public payment_modality?:       string,
        public other_advantages?:       string,
        public status? :                string,
        public school_year?:            string[],
        public convention?:             string, // document lié au stage
        public avenant?:                string, // document lié au stage
        public attestation?:            string, // document lié au stage
        public add_by?:                 string,
        public added_date?:             Date,
        public code_commercial?:             Date,
    ){}
}