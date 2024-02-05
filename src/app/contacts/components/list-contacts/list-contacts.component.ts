import {Component, OnInit} from '@angular/core';
import {ContactService} from "../../../core/services/contact.service";
import {combineLatest, map, tap} from "rxjs";
import {Contact} from "../../models/contact.model";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "../add-contact/add-contact.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss'],
})
export class ListContactsComponent implements OnInit{
  contactList : Array<Contact> = new Array<Contact>();
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', "details"];

  constructor(private contactService: ContactService,
              private dialog: MatDialog,
              private router: Router) {}

  ngOnInit(): void {
    this.initContactList();
    this.searchContact();
  }

  private initContactList() {
    this.contactService.getContacts();
  }

  private searchContact() {
    combineLatest([
      this.contactService.searchQuery$,
      this.contactService.searchType$,
      this.contactService.contacts$
    ]).pipe(
      map(([search, searchType, contacts]) =>
        contacts.filter(contact => contact[searchType].toLowerCase().includes(search as string))),
      tap(contacts => this.contactList = contacts)
    ).subscribe();
  }

  onViewDetails(id: number) {
    this.router.navigateByUrl(`/contacts/${id}`).then();
  }

  onEdit(contact: Contact) {
    const dialogRef = this.dialog.open(AddContactComponent, {data: contact});

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onDelete(id: number) {
    this.contactService.deleteContact(id);
  }

  protected readonly length = length;
}
