import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CompaniesComponent } from './companies/companies.component';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductComponent } from './product/product.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
@NgModule({
  declarations: [
    PagesComponent,
    CompaniesComponent,
    ProductComponent,
    PurchaseOrderComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzButtonModule,
    NzSelectModule
  ]
})
export class PagesModule { }
