import { MessageService } from 'primeng/api';
import { ProductService } from './../product.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit, OnChanges {
  @Input() displayAddEditModal: boolean = true;
  @Input() selectedProduct: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();

  modalType = 'Add';

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    description: [''],
    category: ['', Validators.required],
    image: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedProduct) {
      this.modalType = 'Edit';
      this.productForm.patchValue(this.selectedProduct);
    } else {
      this.modalType = 'Add';
      this.productForm.reset();
    }
  }

  closeModal() {
    this.clickClose.emit(true);
    this.productForm.reset();
  }

  addEditProduct() {
    this.productService
      .addEditProduct(this.productForm.value, this.selectedProduct)
      .subscribe(
        (data) => {
          this.clickAddEdit.emit(data);
          this.closeModal();
          const msg =
            this.modalType === 'Add' ? 'Product added' : 'Product updated';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: msg,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
          console.log(error);
        }
      );
  }
}
