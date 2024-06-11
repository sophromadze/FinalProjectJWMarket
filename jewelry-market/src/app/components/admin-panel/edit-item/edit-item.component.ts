import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import {
  JewelryCategory,
  JewelryCategoryNames,
} from '../../../models/category.model';
import { JewelryItem } from '../../../models/jewelry-item.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  editItemForm: FormGroup;
  itemId!: number; // Use non-null assertion operator
  categories = JewelryCategoryNames;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editItemForm = this.fb.group({
      itemName: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      quantity: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      category: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.itemId = id ? +id : 0; // Use a fallback value
    if (this.itemId > 0) {
      this.loadItem();
    } else {
      console.error('Invalid item ID');
      this.router.navigate(['/admin-panel']);
    }
  }

  loadItem(): void {
    this.itemService.getItemById(this.itemId).subscribe(
      (item: JewelryItem) => {
        this.editItemForm.patchValue({
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        });
      },
      (error) => {
        console.error('Error loading item', error); // Debugging statement
      }
    );
  }

  onUpdate(): void {
    if (this.editItemForm.valid) {
      const formValues = this.editItemForm.value;
      const payload = {
        ...formValues,
        price: parseFloat(formValues.price),
        quantity: parseInt(formValues.quantity),
        category: parseInt(formValues.category, 10),
      };
      console.log('Updating item with payload:', payload); // Debugging statement
      this.itemService.updateItem(this.itemId, payload).subscribe(
        (response) => {
          console.log('Item updated successfully:', response); // Debugging statement
          this.editItemForm.reset();
          this.router.navigate(['/admin-panel']);
        },
        (error) => {
          console.error('Error updating item:', error); // Debugging statement
        }
      );
    } else {
      console.log('Form is invalid:', this.editItemForm); // Debugging statement
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin-panel']);
  }
}
