export default class PaymentDetails {

    constructor (
        public cardnumber : number,
        public cardtype : string,
        public cardname : string,
        public expirydate : string,
        public cvv : number 
    ) {}
}
