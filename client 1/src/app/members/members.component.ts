import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Address, Month } from '../shared/models/User';
import { UserService } from '../shared/services/user.service';
import { MessageService } from '../shared/services/message.service';
import { Message } from '../shared/models/message';
import { AccountService } from '../shared/services/account.service';
import { Account, AddedMember } from '../shared/models/account';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  createForm: FormGroup;
  users: User[];
  selectedUser: User = {};
  accounts: Account[];
  selectedRole = 'all';
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

  displayedColumns: string[] = ['name', 'role', 'mobile', 'addedBy', 'registeredOn', 'city', 'actions'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _formBuilder: FormBuilder, private _user: UserService,
    private _message: MessageService, private _account: AccountService) { }

  ngOnInit() {
    this.selectedUser.address = {};
    this._formInitializer();
    this.getAllMembers();
  }

  private _formInitializer(): void {
    this.createForm = this._formBuilder.group({
      name: ['', Validators.required],
      addedBy: ['', Validators.required],
      role: ['', Validators.required],
      fatherHusbandName: [''],
      email: ['', [Validators.required]],
      mobile: [''],
      gender: ['', Validators.required],
      dob: [''],
      caste: [''],
      maritialStatus: [''],
      highestEducation: [''],
      fees: ['150', Validators.required],
      addressLine: [''],
      city: ['Orai'],
      district: ['Jalaun'],
      state: ['U.P'],
      country: ['India'],
      pincode: ['285001']
    });
  }

  get f() { return this.createForm.controls; }

  toggleModal(modalName: string, status: string): void {
    document.getElementById(modalName).style.display = status;
  }

  getAllMembers(): void {
    this._user.getAllUsers().subscribe(data => {
      if (data.success) {
        this.users = data.result;
        this.users.forEach(user => {
          user.registeredOn = new Date(user.registeredOn);
        });
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        console.error(data);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  filterByMonth(month: Month): void {
    this._user.getAllUsers().subscribe(data => {
      if (data.success) {
        this.users = data.result;
        this.users.forEach(user => {
          user.registeredOn = new Date(user.registeredOn);
        });
        if (month.index !== 12) {
          this.users = this.users.filter((val, i) => val.registeredOn.getMonth() === month.index);
        }

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  changeUserType(): void {
    this._user.getAllUsers().subscribe(data => {
      if (data.success) {
        this.users = data.result;
        this.users.forEach(user => {
          user.registeredOn = new Date(user.registeredOn);
        });
        if (this.selectedRole.toLowerCase() !== 'all') {
          this.users = this.users.filter((val, i) => val.role.toLowerCase() === this.selectedRole.toLowerCase());
        }
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  createMember(): void {
    const addressObj: Address = {
      addressLine: this.f.addressLine.value,
      city: this.f.city.value,
      district: this.f.district.value,
      state: this.f.state.value,
      country: this.f.country.value,
      pincode: this.f.pincode.value,
    };
    const user: User = {
      name: this.f.name.value,
      role: this.f.role.value,
      addedBy: this.f.addedBy.value,
      fatherHusbandName: this.f.fatherHusbandName.value,
      email: this.f.email.value,
      mobile: this.f.mobile.value,
      gender: this.f.gender.value,
      dob: this.f.dob.value,
      caste: this.f.caste.value,
      maritialStatus: this.f.maritialStatus.value,
      highestEducation: this.f.highestEducation.value,
      fees: this.f.fees.value,
      registeredOn: new Date(Date.now()),
      address: addressObj
    };
    this._user.addMember(user).subscribe(data => {
      if (data.success) {
        this.getAllMembers();
        this.createForm.reset();
        this.toggleModal('createMemberModal', 'none');
        this._message.addMessage('success', data.msg);
        this.addAccount(user);
        this.updateAccount(user);
      } else {
        this._message.addMessage('failure', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.toggleModal('updateMemberModal', 'block');
  }

  updateUser(): void {
    console.log(this.selectedUser);
    this._user.updateMember(this.selectedUser).subscribe(data => {
      if (data.success) {
        this.getAllMembers();
        this.toggleModal('updateMemberModal', 'none');
        this.selectedUser = {};
        this.selectedUser.address = {};
        this._message.addMessage('success', data.msg);
      } else {
        console.error(data);
        this._message.addMessage('failure', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  deleteUser(user): void {
    this._user.deleteUser(user._id).subscribe(data => {
      if (data.success) {
        this.getAllMembers();
        this._message.addMessage('success', data.msg);
      } else {
        this._message.addMessage('success', data.msg);
      }
    }, err => {
      this._message.addMessage('failure', err.error.msg);
    });
  }

  addAccount(user: User): void {
    console.log('add account');
    const newAccount: Account = {
      email: user.email,
      name: user.name,
      total_earn_amount: 0,
      total_spend_amount: 0,
      selledProducts: [],
      addedMembers: [],
      modifiedOn: new Date(Date.now())
    };
    this._account.addAccount(newAccount).subscribe(data => {
      this._message.addMessage('success', data.msg);
    }, err => {
      this._message.addMessage('failure', err.msg);
    });
  }

  updateAccount(user: User): void {
    const addedMember: AddedMember = {
      name: user.name,
      email: user.email,
      fees: user.fees,
      date_of_added: user.registeredOn
    };
    this._account.getAccountByMemId(user.addedBy).subscribe(data => {
      if (data.success) {
        const updateAccount: Account = data.result[0];
        updateAccount.total_earn_amount = updateAccount.total_earn_amount + Number(user.fees);
        updateAccount.addedMembers.push(addedMember);
        this._account.updateAccount(updateAccount).subscribe(updateData => {
          this._message.addMessage('success', updateData.msg);
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
