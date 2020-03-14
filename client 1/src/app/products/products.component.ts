import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../shared/models/product';
import { ProductService } from '../shared/services/product.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { MessageService } from '../shared/services/message.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelledProduct, Account } from '../shared/models/account';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  addProductForm: FormGroup;
  sellProductForm: FormGroup;
  products: Product[];
  selectedProduct: Product = {};
  users: User[];
  displayedColumns: string[] = ['name', 'brand', 'buyingPrice', 'sellingPrice', 'quantity', 'addedOn', 'addedBy', 'actions'];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _formBuilder: FormBuilder, private _product: ProductService,
    private _user: UserService, private _message: MessageService, private _account: AccountService) { }

  ngOnInit() {
    this._formInitializer();
    this.getAllProducts();
  }

  toggleModal(modalName: string, status: string): void {
    document.getElementById(modalName).style.display = status.toLowerCase();
  }

  private _formInitializer(): void {
    this.getAllUsers();
    this.addProductForm = this._formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      buyingPrice: [0, Validators.required],
      sellingPrice: [0, Validators.required],
      quantity: [0, Validators.required],
      addedOn: [new Date(), Validators.required],
      addedBy: ['', Validators.required]
    });
    this.sellProductForm = this._formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      unit_price: ['', Validators.required],
      total_price: ['', Validators.required],
      date_of_sell: ['', Validators.required],
      selledBy: ['', Validators.required],
      description: ['']
    });
  }

  getAllUsers(): void {
    this._user.getAllUsers().subscribe(data => {
      if (data.success) {
        this.users = data.result;
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  getAllProducts(): void {
    this._product.getAllProducts().subscribe(data => {
      if (data.success) {
        this.products = data.result;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  addProduct(): void {
    const newProduct: Product = {
      name: this.addProductForm.controls.name.value,
      brand: this.addProductForm.controls.brand.value,
      buyingPrice: this.addProductForm.controls.buyingPrice.value,
      sellingPrice: this.addProductForm.controls.sellingPrice.value,
      quantity: this.addProductForm.controls.quantity.value,
      addedOn: this.addProductForm.controls.addedOn.value,
      addedBy: this.addProductForm.controls.addedBy.value
    };
    this._product.addProduct(newProduct).subscribe(data => {
      if (data.success) {
        this.getAllProducts();
        this.addProductForm.reset();
        this._formInitializer();
        this.toggleModal('createProductModal', 'none');
        this._message.addMessage('success', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.toggleModal('updateProductModal', 'block');
  }

  updateProduct(): void {
    this._product.updateProduct(this.selectedProduct).subscribe(data => {
      if (data.success) {
        this.getAllProducts();
        this.toggleModal('updateProductModal', 'none');
        this._message.addMessage('success', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  deleteProduct(deletedProduct: Product): void {
    this._product.deleteProduct(deletedProduct).subscribe(data => {
      if (data.success) {
        this.getAllProducts();
        this._message.addMessage('success', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  sellProduct(): void {
    const selledProduct: SelledProduct = {
      name: this.sellProductForm.controls.name.value,
      quantity: this.sellProductForm.controls.quantity.value,
      unit_price: this.sellProductForm.controls.unit_price.value,
      total_price: this.sellProductForm.controls.total_price.value,
      date_of_sell: this.sellProductForm.controls.date_of_sell.value,
      description: this.sellProductForm.controls.description.value
    };
    console.log('selled by >> ' + this.sellProductForm.controls.selledBy.value);
    console.log(selledProduct);
    this.updateAccount(this.sellProductForm.controls.selledBy.value, selledProduct);
  }

  updateAccount(name: string, selledProduct: SelledProduct): void {
    this._account.getAccountByMemId(name).subscribe(data => {
      if (data.success) {
        const updateAccount: Account = data.result[0];
        updateAccount.total_earn_amount = updateAccount.total_earn_amount + Number(selledProduct.total_price);
        updateAccount.selledProducts.push(selledProduct);
        this._account.updateAccount(updateAccount).subscribe(updateData => {
          this._message.addMessage('success', updateData.msg);
          this.toggleModal('sellProductModal', 'none');
        });
      }
    });
  }

  // filter for table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
