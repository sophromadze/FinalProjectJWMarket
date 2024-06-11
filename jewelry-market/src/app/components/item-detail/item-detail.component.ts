import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: any;
  categoryNames: string[] = ['ყელსაბამები', 'სამაჯურები', 'ბეჭდები'];

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      const id = params.get('id');
      if (id) {
        this.loadItem(Number(id));
      }
    });
  }

  loadItem(id: number) {
    this.itemService.getItemById(id).subscribe(
      (data: any) => {
        this.item = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCategoryName(categoryIndex: number): string {
    return this.categoryNames[categoryIndex] || 'Unknown Category';
  }

  addToCart(item: any) {
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    // Add item to cart logic here
    console.log('Item added to cart:', item);
  }

  buyItem(item: any) {
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    // Buy item logic here
    console.log('Item bought:', item);
  }

  goBack() {
    this.location.back();
  }
}
