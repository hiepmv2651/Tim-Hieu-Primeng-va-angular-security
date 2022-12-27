import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from './product';
import { ProductService } from './product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  displayAddEditModal = false;
  selectedProduct: any = null;

  loading: boolean = true;

  categories!: any[];

  @ViewChild('dt') table!: Table;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getProductList();

    this.categories = [
      { label: "Men's clothing", value: "Men's clothing" },
      { label: 'Jewelery', value: 'Jewelery' },
      { label: 'Electronics', value: 'electronics' },
      { label: "Women's clothing", value: "Women's clothing" },
    ];
  }

  getProductList() {
    this.productService.getProduct().subscribe((data) => {
      this.products = data;
      this.loading = false;
    });
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedProduct = null;
  }

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
  }

  saveorUpdateProductList() {
    this.getProductList();
  }

  showEditModal(product: Product) {
    this.displayAddEditModal = true;
    this.selectedProduct = product;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete product?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.productService.deleteProduct(product.id).subscribe(
          (response) => {
            this.getProductList();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product not deleted',
            });
          }
        );
      },
    });
  }
}
