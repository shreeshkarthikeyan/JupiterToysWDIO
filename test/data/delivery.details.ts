export class DeliveryDetails {

    constructor(
        public isSameAsContactAddress : boolean,
        public name : string,
        public addressline1 : string,
        public addressline2 : string,
        public suburb : string,
        public state : string,
        public postcode : number 
    ) {}
}