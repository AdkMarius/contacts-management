import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {Observable, take, tap} from "rxjs";
import {ContactService} from "../../../core/services/contact.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "../add-contact/add-contact.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit{
  contact$!: Observable<Contact>;

  constructor(private contactService: ContactService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    const id = +this.route.snapshot.params['id'];
    this.contact$ = this.contactService.getSingleContact(id);
  }

  onGoBack() {
    this.router.navigateByUrl('/contacts').then();
  }

  onDeleteContact() {
    this.contact$.pipe(
      take(1),
      tap(contact => {
        this.contactService.deleteContact(contact.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onEditContact() {
    this.contact$.pipe(
      take(1),
      tap(contact => {
        const dialogRef = this.dialog.open(AddContactComponent, {data: contact});

        dialogRef.afterClosed().subscribe(result => {
          this.router.navigateByUrl(`/contacts/${contact.id}`).then();
        });
      })
    ).subscribe();
  }
}
