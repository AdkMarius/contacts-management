import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "../../../contacts/components/add-contact/add-contact.component";
import {FormBuilder, FormControl} from "@angular/forms";
import {ContactSearchType} from "../../enums/contact-search-type.enum";

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
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(ContactSearchType.LASTNAME);
    this.searchTypeOptions = [
      { value: ContactSearchType.LASTNAME, label: "Nom"},
      { value: ContactSearchType.FIRSTNAME, label: "Prénom"},
      { value: ContactSearchType.EMAIL, label: "Email"},
    ]
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
