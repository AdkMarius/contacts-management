import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "../../../contacts/components/add-contact/add-contact.component";
import {FormBuilder, FormControl} from "@angular/forms";
import {ContactSearchType} from "../../enums/contact-search-type.enum";
import {ContactService} from "../../services/contact.service";
import {map, startWith, tap} from "rxjs";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: ContactSearchType,
    label: string
  }[];

  constructor(private router: Router,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private contactService: ContactService) {}

  ngOnInit(): void {
    this.initObservables();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(ContactSearchType.LASTNAME);
    this.searchTypeOptions = [
      { value: ContactSearchType.LASTNAME, label: "Nom"},
      { value: ContactSearchType.FIRSTNAME, label: "Prénom"},
    ]
  }

  private initObservables() {
    this.initForm();
    this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase()),
      tap(value => this.contactService.setSearchQuery(value))
    ).subscribe();

    this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value),
      tap(searchType => this.contactService.setSearchType(searchType))
    ).subscribe();
  }


  onListContact() {
    this.router.navigateByUrl('/contacts').then();
  }

  onAddContact() {
    const dialogRef = this.dialog.open(AddContactComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
