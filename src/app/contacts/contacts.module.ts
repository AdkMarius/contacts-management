import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactRoutingModule} from "./contact.routing.module";
import { AddContactComponent } from './components/add-contact/add-contact.component';
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    AddContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule
  ]
})
export class ContactsModule { }