import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListContactsComponent} from "./components/list-contacts/list-contacts.component";
import {ContactComponent} from "./components/contact/contact.component";

const routes: Routes = [
  { path: '', component: ListContactsComponent },
  { path: ':id', component: ContactComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
