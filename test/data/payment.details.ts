export default class PaymentDetails {

    constructor (
        public cardnumber : number = 1234123412341234,
        public cardtype : string = "Mastercard",
        public cardname : string = "Shreesh Karthikeyan",
        public expirydate : string = "12/26",
        public cvv : number = 123
    ) {}
}
