import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "../../../contacts/components/add-contact/add-contact.component";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(private router: Router,
              private dialog: MatDialog) {}

  onListContact() {
    this.router.navigateByUrl('/contacts');
  }

  onAddContact() {
    const dialogRef = this.dialog.open(AddContactComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
