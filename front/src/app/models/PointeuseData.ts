export class PointeuseData {

    constructor(
        public _id?: string,
        public serial_number?: string,
        public nb_users?: number,
        public nom_appareil?: string,
        public ip?: string,
        public mask?: string,
        public gateway?: string,
        public firmware?: string,
        public plateforme?: string,
        public adresse_mac?: string,
        public nb_faces?: number,
        public nb_fingers?: number,
        public users?: string
    ) { }

}