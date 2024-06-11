import { JewelryCategory } from './category.model';

export interface JewelryItem {
  id: number;
  itemName: string;
  price: number;
  category: JewelryCategory;
  quantity: number;
}
