import { Component, OnInit, ViewChild } from '@angular/core';
import { Account, AddedMember, Spend } from '../shared/models/account';
import { AccountService } from '../shared/services/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '../shared/services/message.service';
import { UserService } from '../shared/services/user.service';
import { Fathers, Month } from '../shared/models/User';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  spendForm: FormGroup;
  accounts: Account[];
  selectedAccount: Account;
  selectedUser: Fathers;
  vewModal = true;
  months: Month[] = [
    {
      name: 'all',
      index: 12
    },
    {
      name: 'jan',
      index: 0
    },
    {
      name: 'feb',
      index: 1
    },
    {
      name: 'mar',
      index: 2
    },
    {
      name: 'apr',
      index: 3
    },
    {
      name: 'may',
      index: 4
    },
    {
      name: 'jun',
      index: 5
    },
    {
      name: 'jul',
      index: 6
    },
    {
      name: 'aug',
      index: 7
    },
    {
      name: 'sep',
      index: 8
    },
    {
      name: 'oct',
      index: 9
    },
    {
      name: 'nov',
      index: 10
    },
    {
      name: 'dec',
      index: 11
    }
  ];

  displayedColumns: string[] = [
    'name', 'total_earned_amount', 'total_spend_amount',
    'total_added_members', 'total_selled_products', 'last_updated', 'actions'];
  dataSource: MatTableDataSource<Account>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumnsMembers: string[] = [
    'name', 'email', 'fees',
    'date_of_added'];
  dataSourceMembers: MatTableDataSource<AddedMember>;
  @ViewChild(MatPaginator, { static: true }) paginatorMembers: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortMembers: MatSort;

  displayedColumnsProducts: string[] = [
    'name', 'quantity', 'unit_price',
    'total_price', 'date_of_sell'];
  dataSourceProducts: MatTableDataSource<AddedMember>;
  @ViewChild(MatPaginator, { static: true }) paginatorProducts: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortProducts: MatSort;

  displayedColumnsSpends: string[] = [
    'name', 'description', 'type',
    'amount', 'date_of_spend'];
  dataSourceSpends: MatTableDataSource<Spend>;
  @ViewChild(MatPaginator, { static: true }) paginatorSpends: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortSpends: MatSort;

  constructor(private _account: AccountService, private _formBuilder: FormBuilder,
    private _message: MessageService, private _user: UserService) { }

  ngOnInit() {
    this.getAllAccounts();
    this._formInitializer();
  }

  private _formInitializer(): void {
    this.spendForm = this._formBuilder.group({
      name: ['', Validators.required],
      spendBy: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      amount: ['', Validators.required],
      date_of_spend: ['', Validators.required]
    });
  }

  getAllAccounts(): void {
    this._account.getAllAccounts().subscribe(response => {
      if (response.success) {
        this.accounts = response.result;
        this.selectedAccount = this.accounts[0];
        this.accounts.forEach(account => {
          account.modifiedOn = new Date(account.modifiedOn);
          if (account.total_spend_amount === undefined) {
            account.total_spend_amount = 0;
          }
        });
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.accounts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  toggleModal(id: string, value: string): void {
    document.getElementById(id).style.display = value;
  }

  selectAccount(selectedAccount: Account): void {
    this.selectedAccount = selectedAccount;
    // Assign the data to the data source for the table to render
    this.dataSourceMembers = new MatTableDataSource(this.selectedAccount.addedMembers);
    this.dataSourceMembers.paginator = this.paginatorMembers;
    this.dataSourceMembers.sort = this.sortMembers;

    this.dataSourceProducts = new MatTableDataSource(this.selectedAccount.selledProducts);
    this.dataSourceProducts.paginator = this.paginatorMembers;
    this.dataSourceProducts.sort = this.sortMembers;

    this.dataSourceSpends = new MatTableDataSource(this.selectedAccount.spends);
    this.dataSourceSpends.paginator = this.paginatorSpends;
    this.dataSourceSpends.sort = this.sortSpends;

    this.toggleModal('accountModal', 'block');
  }

  addSpend(): void {
    const newSpend: Spend = {
      name: this.spendForm.controls.name.value,
      description: this.spendForm.controls.description.value,
      type: this.spendForm.controls.type.value,
      amount: this.spendForm.controls.amount.value,
      date_of_spend: this.spendForm.controls.date_of_spend.value,
    };
    this._account.getAccountByMemId(this.spendForm.controls.spendBy.value).subscribe(data => {
      if (data.success) {
        const updateAccount: Account = data.result[0];
        updateAccount.total_spend_amount = updateAccount.total_spend_amount + Number(newSpend.amount);
        updateAccount.spends.push(newSpend);
        this._account.updateAccount(updateAccount).subscribe(updatedAccount => {
          if (updatedAccount.success) {
            this._message.addMessage('success', updatedAccount.msg);
            this.getAllAccounts();
            this.toggleModal('spendModal', 'none');
          }
        });
      }
    });
  }

  getFathersDetails(name: string): void {
    this._user.getFathersDetails(name).subscribe(data => {
      if (data.success) {
        this.selectedUser = data.result[0];
        console.log(this.selectedUser);
        this.toggleModal('fathersModal', 'block');
      }
    });
  }

  filterMembersByMonth(month: Month): void {
    this._account.getAllAccounts().subscribe(data => {
      if (data.success) {
        this.accounts = data.result;
        this.selectedAccount = this.accounts.filter((val, i) => val._id === this.selectedAccount._id)[0];
        this.selectedAccount.addedMembers.forEach(member => {
          member.date_of_added = new Date(member.date_of_added);
        });
        if (month.index !== 12) {
          this.selectedAccount.addedMembers =
            this.selectedAccount.addedMembers.filter((val, i) => val.date_of_added.getMonth() === month.index);
        }
        this.dataSourceMembers = new MatTableDataSource(this.selectedAccount.addedMembers);
        this.dataSourceMembers.paginator = this.paginatorMembers;
        this.dataSourceMembers.sort = this.sortMembers;
      }
    });
  }

  filterProductsByMonth(month: Month): void {
    this._account.getAllAccounts().subscribe(data => {
      if (data.success) {
        this.accounts = data.result;
        this.selectedAccount = this.accounts.filter((val, i) => val._id === this.selectedAccount._id)[0];
        this.selectedAccount.selledProducts.forEach(product => {
          product.date_of_sell = new Date(product.date_of_sell);
        });
        if (month.index !== 12) {
          this.selectedAccount.selledProducts =
            this.selectedAccount.selledProducts.filter((val, i) => val.date_of_sell.getMonth() === month.index);
        }
        this.dataSourceProducts = new MatTableDataSource(this.selectedAccount.selledProducts);
        this.dataSourceProducts.paginator = this.paginatorProducts;
        this.dataSourceProducts.sort = this.sortProducts;
      }
    });
  }

  filterSpendsByMonth(month: Month): void {
    this._account.getAllAccounts().subscribe(data => {
      if (data.success) {
        this.accounts = data.result;
        this.selectedAccount = this.accounts.filter((val, i) => val._id === this.selectedAccount._id)[0];
        this.selectedAccount.spends.forEach(spend => {
          spend.date_of_spend = new Date(spend.date_of_spend);
        });
        if (month.index !== 12) {
          this.selectedAccount.spends =
            this.selectedAccount.spends.filter((val, i) => val.date_of_spend.getMonth() === month.index);
        }
        this.dataSourceSpends = new MatTableDataSource(this.selectedAccount.spends);
        this.dataSourceSpends.paginator = this.paginatorSpends;
        this.dataSourceSpends.sort = this.sortSpends;
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

  applyFilterMembers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMembers.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceMembers.paginator) {
      this.dataSourceMembers.paginator.firstPage();
    }
  }

  applyFilterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }
}
