import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  category: string | null = null;
  categoryNames: string[] = ['necklaces', 'bracelets', 'rings'];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Listen to route params to load items based on category
    this.route.params.subscribe((params) => {
      if (params['category']) {
        this.setCategory(params['category']);
      } else {
        this.resetItems();
      }
    });
  }

  ngOnInit() {
    // Initially, no items are loaded. Only categories are displayed.
  }

  loadItems(category: string) {
    this.category = category;
    const categoryIndex = this.categoryNames.indexOf(category);
    if (categoryIndex !== -1) {
      this.itemService.getItemsByCategory(categoryIndex).subscribe(
        (data: any[]) => {
          this.items = data;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  viewItem(item: any) {
    this.router.navigate(['/items', this.category, item.id]);
  }

  setCategory(category: string) {
    this.category = category;
    this.loadItems(category);
    this.router.navigate(['/items', category]);
  }

  resetItems() {
    this.category = null;
    this.items = [];
  }

  backToCategories() {
    this.category = null;
    this.items = [];
  }
}
