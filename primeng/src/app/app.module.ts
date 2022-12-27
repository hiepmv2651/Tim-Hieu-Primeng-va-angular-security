import { ProductModule } from './product/product.module';
import { ProductComponent } from './product/product.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ProductModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
