import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor() {}

  ngOnInit() {
    // Fetch cart items from a service or local storage
    this.cartItems = this.getCartItems();
  }

  getCartItems() {
    // Example logic to get cart items, replace with actual logic
    return [
      { id: 1, itemName: 'Necklace', price: 100, category: 'Necklace' },
      { id: 2, itemName: 'Bracelet', price: 150, category: 'Bracelet' },
    ];
  }

  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
  }
}
