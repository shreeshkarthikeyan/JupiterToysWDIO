export class IContactDetails {

    constructor ( 
        public firstname : string, 
        public lastname : string, 
        public email : string, 
        public phoneNumber : number,
        public addressline1 : string, 
        public addressline2 : string,
        public suburb : string,
        public state : string,
        public postcode : number ) {
        
            if(!(email.includes("@")))
                throw new Error("Invalid email");
            if(email[email.length - 1] === "@")
                throw new Error("Invalid email format");
            if(!(postcode.toString().length === 4))
                throw new Error("Invalid postcode");
    }
}
