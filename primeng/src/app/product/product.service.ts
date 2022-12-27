import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  addEditProduct(postData: any, selectedProduct: any) {
    if (!selectedProduct) {
      return this.http.post<Product>(
        'http://localhost:3000/products',
        postData
      );
    } else {
      return this.http.put<Product>(
        `http://localhost:3000/products/${selectedProduct.id}`,
        postData
      );
    }
  }

  deleteProduct(id: number) {
    return this.http.delete<Product>(`http://localhost:3000/products/${id}`);
  }
}
