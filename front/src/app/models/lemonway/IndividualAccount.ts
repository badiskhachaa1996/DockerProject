export class IndividualAccount{
    public constructor(
        public accountId?:                      string,
        public email?:                          string,
        public title?:                          string,
        public firstName?:                      string,
        public lastName?:                       string,
        public adresse?: {
                           street?:             string,
                           postCode?:           string,
                           city:                string,
                           country:             string
                        },  
        public birth?:   {
                            date:               string,
                            city? :             string,
                            country?:           string
                        },
        public nationality?:                    string,
        public phoneNumber?:                    string,
        public mobileNumber?:                   string,
        public isDebtor?:                       boolean,
        public payerOrBeneficiary?:             number,
        public isOneTimeCustomerAccount?:       boolean,
        public isTechnicalAccount?:             boolean,
        public isUltimateBeneficialOwner?:      boolean
    ){}; 
}