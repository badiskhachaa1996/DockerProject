const mongoose = require('mongoose');

const IndividualAccountSchema = mongoose.Schema({
    accountId: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    adresse: { type: mongoose.Schema.Types.Mixed, required: true },
    birth: { type: mongoose.Schema.Types.Mixed, required: true },
    nationality: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    isDebtor: { type: Boolean, required: false },
    payerOrBeneficiary: { type: Boolean, required: false },
    isOneTimeCustomerAccount: { type: Boolean, required: false },
    isTechnicalAccount: { type: Boolean, required: false },
    isUltimateBeneficialOwner: { type: Boolean, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false }
});

const IndividualAccount = mongoose.model("individualAccounts", IndividualAccountSchema);

module.exports = { IndividualAccount };