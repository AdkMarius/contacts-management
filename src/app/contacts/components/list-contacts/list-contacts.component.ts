import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ContactService} from "../../../core/services/contact.service";
import {tap} from "rxjs";
import {Contact} from "../../models/contact.model";

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListContactsComponent implements OnInit{
  contactList : Array<Contact> = new Array<Contact>();
  displayedColumns: string[] = ["number", 'firstName', 'lastName', 'phoneNumber', "details"];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts();
    this.contactService.contacts$.pipe(
      tap(contacts => {
        this.contactList = contacts;
      })
    ).subscribe();
  }

  onViewDetails() {

  }

  onEdit() {

  }

  onDelete() {

  }
}
