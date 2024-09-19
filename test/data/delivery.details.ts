export default class DeliveryDetails {

    constructor(
        public name : string = "Student Housing Accomodation",
        public addressline1 : string = "Unit 201, 2 Eastern Place",
        public addressline2 : string = "",
        public suburb : string = "Hawthorn East",
        public state : string = "VIC",
        public postcode : number  = 3123
    ) {}
}