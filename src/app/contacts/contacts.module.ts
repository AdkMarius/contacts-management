import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ContactRoutingModule} from "./contact.routing.module";
import { AddContactComponent } from './components/add-contact/add-contact.component';
import {SharedModule} from "../shared/shared.module";
import {CoreModule} from "../core/core.module";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";



@NgModule({
  declarations: [
    AddContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule,
    CoreModule,
    NgxIntlTelInputModule
  ]
})
export class ContactsModule { }
