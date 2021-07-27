import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CompanyModel } from 'src/app/core/pages/_models/companies.model';
import { CustomValidator } from 'src/app/core/_base/utils/custom-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companiesForm: FormGroup = new FormGroup({});
  companies: CompanyModel[] = [];
  company: CompanyModel = new CompanyModel();
  isSubmit = false;
  constructor(private companiesFb: FormBuilder,
    private message: NzMessageService) {
  }

  ngOnInit(): void {
    if (localStorage.companies) {
      this.companies = JSON.parse(localStorage.companies)
    }
    this.createForm();
  }

  createForm() {
    this.companiesForm = this.companiesFb.group({
      name: [this.company.name, Validators.required],
      gst: [this.company.gst, [Validators.required, CustomValidator.GSTINValidators],],
    })
  }

  onSubmit() {
    this.isSubmit = true;
    const controls = this.companiesForm.controls;
    if (this.companiesForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message.create(
        'error',
        `Oh Snap! Change a few things up and try again`
      );
      return;
    }
    let editedCompany = this.prepareCompany();
    this.addCompany(editedCompany);
  }

  prepareCompany() {
    const controls = this.companiesForm.controls;
    const _company = new CompanyModel();
    _company.id = this.companies.length + 1;
    _company.name = controls['name'].value;
    _company.gst = controls['gst'].value;
    return _company
  }

  addCompany(_company: CompanyModel) {
    this.companies.push(_company)
    setTimeout(() => {
      localStorage.setItem("companies", JSON.stringify(this.companies));
      this.isSubmit = false;
      this.message.success('Company Saved Sucessfully')
      this.companiesForm.reset();
    }, 1000);
  }
}
