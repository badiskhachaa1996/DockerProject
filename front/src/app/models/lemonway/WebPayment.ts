export class WebPayment {
    public constructor(
        public returnUrl?: string,
        public errorUrl?: string,
        public cancelUrl?: string,
        public registerCard?: boolean,
        public captureDelayedDays?: number,
        public label? : string,
        public cardId?: string,
        public moneyInNature?: number,
        public recurringAvgAmount?: number,
        public accountId?: string,
        public totalAmount?: number,
        public commissionAmount?: number,
        public comment?: string,
        public autoCommission?: boolean,
    ){}
}