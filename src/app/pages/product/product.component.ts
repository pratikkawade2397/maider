import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CompanyModel } from 'src/app/core/pages/_models/companies.model';
import { ProductModel } from 'src/app/core/pages/_models/product.model';
import { NzOption } from 'src/app/core/_base/utils/nz-options.interface';
interface MyObj {
  name: string;
  gst: string;
  id: number;
}
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  products: ProductModel[] = [];
  product: ProductModel = new ProductModel();
  companyOptions: NzOption[] = [];
  isSubmit = false;
  constructor(private productFb: FormBuilder,
    private message: NzMessageService) {
    this.getAssets();
  }

  getAssets() {
    var companiesString: string | null = localStorage.getItem("companies");
    if (companiesString){
      var companies = JSON.parse(companiesString);
      companies.forEach((element: CompanyModel) => {
        this.companyOptions.push({label: element.name, value: element.id})
      });
      
    }
  }

  ngOnInit(): void {
    if (localStorage.products) {
      this.products = JSON.parse(localStorage.products)
    }
    this.createForm();
  }

  createForm() {
    this.productForm = this.productFb.group({
      name: [this.product.name, Validators.required],
      companyId: [this.product.companyId, Validators.required],
      cost: [this.product.cost, Validators.required],
    })
  }

  onSubmit() {
    this.isSubmit = true;
    const controls = this.productForm.controls;
    if (this.productForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message.create(
        'error',
        `Oh Snap! Change a few things up and try again`
      );
      return;
    }
    let editedProduct = this.prepareProduct();
    this.addProduct(editedProduct);
  }

  prepareProduct() {
    const controls = this.productForm.controls;
    const _product = new ProductModel();
    _product.id = this.products.length + 1;
    _product.name = controls['name'].value;
    _product.companyId = controls['companyId'].value;
    _product.cost = controls['cost'].value;
    return _product
  }

  addProduct(_product: ProductModel) {
    if (this.isSameProductExists(_product)){
      return;
    }
    this.products.push(_product)
    setTimeout(() => {
      localStorage.setItem("products", JSON.stringify(this.products));
      this.isSubmit = false;
      this.message.success('Product Saved Sucessfully')
      this.productForm.reset();
    }, 1000);
  }


  private isSameProductExists(_product: ProductModel) {
    var isAvailable: boolean = false;
    this.products.forEach(element => {
      if (element.name == _product.name) {
        this.message.create(
          'error',
          `Oh Snap! Product already exists`
        );
        this.isSubmit = false;
        this.productForm.reset();
        isAvailable =  true;
      } else {
        isAvailable =  false;
      }
    });
    return isAvailable;
  }
}
