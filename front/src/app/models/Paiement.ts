export class Paiement {
    constructor(
        public inscriptionId: string,
        public typePaiement: string,
        public nomDonneurDordre: string,
        public numVirement: string,
        public datePaiement: string,
        public paysVirement: string,
        public montantVirement: string,
        public remarque?: string,
        public pathJustificatif?: string,
        public statut_paiement?: string,

    ) { }

}
