import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import {
  JewelryCategory,
  JewelryCategoryNames,
} from '../../../models/category.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  addItemForm: FormGroup;
  categories = JewelryCategoryNames;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router
  ) {
    this.addItemForm = this.fb.group({
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addItemForm.valid) {
      const formValues = this.addItemForm.value;
      const payload = {
        ...formValues,
        price: parseFloat(formValues.price),
        quantity: parseInt(formValues.quantity),
        category: parseInt(formValues.category, 10),
      };
      console.log('Submitting payload:', payload); // Debugging statement
      this.itemService.addItem(payload).subscribe(
        (response) => {
          console.log('Item added successfully:', response); // Debugging statement
          this.addItemForm.reset();
          this.router.navigate(['/admin-panel']);
        },
        (error) => {
          console.error('Error adding item:', error); // Debugging statement
        }
      );
    } else {
      console.log('Form is invalid:', this.addItemForm); // Debugging statement
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin-panel']);
  }
}
