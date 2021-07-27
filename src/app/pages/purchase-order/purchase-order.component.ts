import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CompanyModel } from 'src/app/core/pages/_models/companies.model';
import { ProductModel } from 'src/app/core/pages/_models/product.model';
import { PurchaseOrderModel } from 'src/app/core/pages/_models/purchase-order.model';
import { NzOption } from 'src/app/core/_base/utils/nz-options.interface';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrderForm: FormGroup = new FormGroup({});
  productOptions: NzOption[] = [];
  products: ProductModel[] = [];
  companyOptions: NzOption[] = [];
  purchaseOrder: PurchaseOrderModel[] = [];

  isSubmit: boolean = false;
  isCompanySelected: boolean = true;
  selectedCompany!: any;
  constructor(private productFb: FormBuilder,
    private message: NzMessageService) {
    this.getAssets();
  }

  ngOnInit(): void {
    this.createForm();
  }

  getAssets() {
    var companiesString: string | null = localStorage.getItem("companies");
    var productsString: string | null = localStorage.getItem("products");
    if (companiesString) {
      var companies = JSON.parse(companiesString);
      companies.forEach((element: CompanyModel) => {
        this.companyOptions.push({ label: element.name, value: element.id })
      });
    }
    if (productsString) {
      this.products = JSON.parse(productsString);
    }
  }

  createForm() {
    this.purchaseOrderForm = this.productFb.group({
      // orderNo: ['', Validators.required],
      companyId: ['', Validators.required],
      productId: ['', Validators.required],
      rate: ['', Validators.required],
      quantity: ['', Validators.required],
      total: ['', Validators.required]
    })
    this.conditionalFormUpdates();
  }

  private conditionalFormUpdates() {
    this.purchaseOrderForm.controls['quantity'].valueChanges.subscribe(res => {
      if (res) {
        const rate = this.purchaseOrderForm.controls['rate'].value;
        const quantity = this.purchaseOrderForm.controls['quantity'].value;
        this.purchaseOrderForm.controls['total'].setValue(rate * quantity);
      }
    });
  }

  onSubmit() {
    this.isSubmit = true;
    const controls = this.purchaseOrderForm.controls;
    if (this.purchaseOrderForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message.create(
        'error',
        `Oh Snap! Change a few things up and try again`
      );
      return;
    }
    let editedPurchaseOrder = this.preparePurchaseOrder();
    this.addPurchaseOrder(editedPurchaseOrder);
  }

  preparePurchaseOrder() {
    const controls = this.purchaseOrderForm.controls;
    const _purchaseOrder = new PurchaseOrderModel();
    _purchaseOrder.id = this.purchaseOrder.length + 1;
    const _date = new Date();
    _purchaseOrder.orderNo = `PO/${_date.getFullYear()}/`;
    _purchaseOrder.companyId = controls['companyId'].value;
    _purchaseOrder.productId = controls['productId'].value;
    _purchaseOrder.rate = controls['rate'].value;
    _purchaseOrder.quantity = controls['quantity'].value;
    return _purchaseOrder
  }

  addPurchaseOrder(_purchaseOrder: PurchaseOrderModel) {
    var storedPurchaseOrders = localStorage.getItem('purchaseOrders');
    storedPurchaseOrders += JSON.stringify(_purchaseOrder)
    setTimeout(() => {
      localStorage.setItem("purchaseOrders", JSON.stringify(storedPurchaseOrders));
      this.isSubmit = false;
      this.message.success('Purchase Order Saved Sucessfully')
      this.purchaseOrderForm.reset();
    }, 1000);
  }

  onCompanyChange() {
    const selectedCompany = this.purchaseOrderForm.controls['companyId'].value;
    this.purchaseOrderForm.controls['productId'].reset();
    this.productOptions = [];
    this.products.forEach(element => {
      if (element.companyId == selectedCompany) {
        this.productOptions.push({ label: element.name, value: element.id })
        this.isCompanySelected = false;
      }
    });
  }

  setProductRate(){
    const selectedProduct = this.purchaseOrderForm.controls['productId'].value;
    const productRate = this.products.find(_product => _product.id == selectedProduct)?.cost;
    this.purchaseOrderForm.controls['rate'].setValue(productRate);
  }
}