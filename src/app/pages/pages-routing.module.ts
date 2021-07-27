import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { PagesComponent } from './pages.component';
import { ProductComponent } from './product/product.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'companies',
        component: CompaniesComponent
      },
      {
        path: 'products',
        component: ProductComponent
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
