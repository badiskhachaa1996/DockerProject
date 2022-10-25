export class IndividualAccount{
    public constructor(
        public _id?:                            string,
        public accountId?:                      string,
        public email?:                          string,
        public title?:                          string,
        public firstName?:                      string,
        public lastName?:                       string,
        public adresse?:                        any,
        public birth?:                          any,
        public nationality?:                    string,
        public phoneNumber?:                    string,
        public mobileNumber?:                   string,
        public isDebtor?:                       boolean,
        public payerOrBeneficiary?:             number,
        public isOneTimeCustomerAccount?:       boolean,
        public isTechnicalAccount?:             boolean,
        public isUltimateBeneficialOwner?:      boolean,
        public user_id?:                        string,
    ){};
}