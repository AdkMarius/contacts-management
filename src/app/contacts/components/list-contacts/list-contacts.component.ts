import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ContactService} from "../../../core/services/contact.service";
import {Observable} from "rxjs";
import {Contact} from "../../models/contact.model";
import {HttpErrorResponse} from "@angular/common/http";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit{
  contacts$!: Observable<Contact[]>;
  contactList : Array<Contact> = new Array<Contact>();
  isLoading = false;
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', "details"];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts$ = this.contactService.getContacts();
    this.isLoading = true;
    this.contactService.getContacts().subscribe({
      next: response => {
        this.contactList = response;
        this.isLoading = false;
      },
      error : (err : HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }
}
