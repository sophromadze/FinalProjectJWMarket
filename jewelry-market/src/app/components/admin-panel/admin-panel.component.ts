import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import {
  JewelryCategory,
  JewelryCategoryNames,
} from '../../models/category.model';
import { JewelryItem } from '../../models/jewelry-item.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  items: JewelryItem[] = [];
  categories = JewelryCategoryNames;

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe(
      (response) => {
        this.items = response;
      },
      (error) => {
        console.error('Error fetching items', error);
      }
    );
  }

  getItemsByCategory(category: JewelryCategory): JewelryItem[] {
    return this.items.filter((item) => item.category === category);
  }

  navigateToAddItem(): void {
    this.router.navigate(['/add-item']);
  }

  navigateToEditItem(itemId: number): void {
    this.router.navigate(['/edit-item', itemId]);
  }

  onDelete(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe(
      (response) => {
        console.log('Item deleted successfully', response);
        this.loadItems();
      },
      (error) => {
        console.error('Error deleting item', error);
      }
    );
  }
}
