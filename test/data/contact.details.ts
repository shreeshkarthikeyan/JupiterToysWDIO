export class ContactDetails {

    constructor ( 
        public firstname : string, 
        public lastname : string, 
        public email : string, 
        public phoneNumber : number,
        public addressline1 : string, 
        public addressline2 : string,
        public suburb : string,
        public state : string,
        public postcode : number 
    ) {}
}
