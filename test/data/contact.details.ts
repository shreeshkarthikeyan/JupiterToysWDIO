export default class ContactDetails {

    constructor ( 
        public firstname : string = "Shreesh", 
        public lastname : string = "Karthikeyan", 
        public email : string = "shreeshkarthikeyan30@gmail.com", 
        public phoneNumber : number = 61456314971,
        public addressline1 : string = "2, Coppin Close", 
        public addressline2 : string = "",
        public suburb : string = "Hampton Park",
        public state : string = "VIC",
        public postcode : number = 3976
    ) {}
}
