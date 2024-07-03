import { Toy } from "../model/toy.js";

export default class CartItems {
    public static cartItems: Map<string, Toy> = new Map<string, Toy>();


    public static addToyInCartList(toyName: string, quantity: number, price: number) : void{
        if(this.cartItems.has(toyName)){
            const toyDetails : any = this.cartItems.get(toyName);
            toyDetails.quantity += quantity;
            this.cartItems.set(toyName, toyDetails);
        } else {
            this.cartItems.set(toyName, new Toy(toyName, quantity, price))
        }
    }

    public static getToySubTotal(toyName: string) : number {
        const toy : any = this.cartItems.get(toyName); 
        const subTotal : number = toy.price * toy.quantity;
        console.log(toyName+ " Internally calculated subtotal : " + subTotal);
        return subTotal;
    }

    public static getTotalPrice() {
        let totalPrice : number = 0;
        this.cartItems.forEach(element => {
            totalPrice += (element.price * element.quantity);
        });
        console.log("Internally calculated total price : "+ totalPrice);
        return totalPrice;
    }

    public static get cartList(): any {
        return this.cartItems;
    }
    
}