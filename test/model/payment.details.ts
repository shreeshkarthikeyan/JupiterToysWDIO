export class PaymentDetails {

    constructor (
        public cardnumber : number,
        public cardtype : string,
        public cardname : string,
        public expirydate : string,
        public cvv : number ) {
            if(!(cardnumber.toString().length === 16))
                throw new Error("Invalid cardnumber");
            if(!(expirydate.includes("/")))
                throw new Error("Invalid expiry date")
            if(!(expirydate.length === 5))
                throw new Error("Invalid expiry date format")
            if(!(cvv.toString().length === 3))
                throw new Error("Invalid cvv");

    }
}
