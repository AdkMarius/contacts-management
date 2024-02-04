import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, Observable, switchMap, take, tap} from "rxjs";
import {Contact} from "../../contacts/models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private _contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  constructor(private http: HttpClient) {}

  get contacts$(): Observable<Contact[]> {
    return this._contacts$.asObservable();
  }

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts').pipe(
      tap(contacts => this._contacts$.next(contacts))
    ).subscribe();
  }

  addContact(data: Contact) {
    const currentContacts = this._contacts$.value;
    const updatedContacts = [...currentContacts, data];
    this._contacts$.next(updatedContacts);
  }

  createNewContact(formValue: {firstName: string, lastName: string, email: string, phoneNumber: string, birthDate: string}): Observable<Contact> {
    return this.contacts$.pipe(
      take(1),
      map(contacts => [...contacts].sort((a, b) => a.id - b.id)),
      map(sortedContacts => sortedContacts[sortedContacts.length - 1]),
      map(previousContact => ({
        id: +previousContact.id + 1,
        ...formValue
      })),
      switchMap(contact =>
        this.http.post<Contact>('http://localhost:3000/contacts', contact)
      )
    );
  }

  deleteContact(id: number) {
    this.http.delete(`http://localhost:3000/contacts/${id}`).pipe(
      switchMap(() => this.contacts$),
      take(1),
      map(contacts => contacts.filter(contact => contact.id !== id)),
      tap(contacts => {
        console.log(contacts);
        this._contacts$.next(contacts);
      })
    ).subscribe();
  }

  editContact(id: number, formValue: {firstName: string, lastName: string, email: string, phoneNumber: string, birthDate: string}): Observable<Contact> {
    return this.contacts$.pipe(
      take(1),
      map(contacts => contacts
        .map(contact => contact.id === id ? {
              id: id,
              ...formValue
            } : contact
        )
      ),
      switchMap(contacts =>
        this.http.patch<Contact>(
          `http://localhost:3000/contacts/${id}`,
          contacts.find(contact => contact.id === id)
        )
      )
    );
  }

  editData(data: Contact) {
    const contacts = this._contacts$.value;
    const updatedContacts = contacts.map(contact => contact.id == data.id ? { ...data } : contact);
    this._contacts$.next(updatedContacts);
  }

  getSingleContact(id: number): Observable<Contact> {
    return this.contacts$.pipe(
      map(contacts => contacts.filter(contact => contact.id === id)[0])
    );
  }
}
