import { AddEditProductModule } from './add-edit-product/add-edit-product.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    AddEditProductModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    FormsModule,
  ],
  exports: [ProductComponent],
  providers: [MessageService, ConfirmationService],
})
export class ProductModule {}
