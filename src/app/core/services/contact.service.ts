import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, Observable, switchMap, tap} from "rxjs";
import {Contact} from "../../contacts/models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('http://localhost:3000/contacts');
  }

  createNewContact(formValue: {firstName: string, lastName: string, email: string, phoneNumber: string, birthDate: string}): Observable<Contact> {
    return this.getContacts().pipe(
      map(contacts => [...contacts].sort((a, b) => a.id - b.id)),
      map(sortedContacts => sortedContacts[sortedContacts.length - 1]),
      map(previousContact => ({
        ...formValue,
        id: +previousContact.id + 1
      })),
      switchMap(contact =>
        this.http.post<Contact>('http://localhost:3000/contacts', contact))
    );
  }
}
