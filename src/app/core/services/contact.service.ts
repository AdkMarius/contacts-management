import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, switchMap, take, tap} from "rxjs";
import {Contact} from "../../contacts/models/contact.model";
import {ContactSearchType} from "../enums/contact-search-type.enum";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private _contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  private _searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _searchType$: BehaviorSubject<ContactSearchType> = new BehaviorSubject<ContactSearchType>(ContactSearchType.LASTNAME);

  constructor(private http: HttpClient) {}

  get contacts$(): Observable<Contact[]> {
    return this._contacts$.asObservable();
  }

  get searchQuery$(): Observable<string> {
    return this._searchQuery$.asObservable();
  }

  setSearchQuery(query: string) {
    this._searchQuery$.next(query);
  }

  get searchType$(): Observable<ContactSearchType> {
    return this._searchType$.asObservable();
  }

  setSearchType(type: ContactSearchType) {
    this._searchType$.next(type);
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

  createNewContact(formValue: {firstName: string, lastName: string, email: string, phoneNumber: {internationalNumber: string}, birthDate: string}): Observable<Contact> {
    return this.contacts$.pipe(
      take(1),
      map(contacts => [...contacts].sort((a, b) => a.id - b.id)),
      map(sortedContacts => sortedContacts[sortedContacts.length - 1]),
      map(previousContact => ({
        id: +previousContact.id + 1,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber.internationalNumber,
        birthDate: formValue.birthDate
      })),
      switchMap(contact =>
        this.http.post<Contact>(`${environment.apiUrl}/contacts`, contact)
      )
    );
  }

  deleteContact(id: number) {
    this.http.delete(`${environment.apiUrl}/contacts/${id}`).pipe(
      switchMap(() => this.contacts$),
      take(1),
      map(contacts => contacts.filter(contact => contact.id !== id)),
      tap(contacts => {
        console.log(contacts);
        this._contacts$.next(contacts);
      })
    ).subscribe();
  }

  editContact(id: number, formValue: {firstName: string, lastName: string, email: string, phoneNumber: {internationalNumber: string}, birthDate: string}): Observable<Contact> {
    return this.contacts$.pipe(
      take(1),
      map(contacts => contacts
        .map(contact => contact.id === id ? {
            id: id,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            phoneNumber: formValue.phoneNumber.internationalNumber,
            birthDate: formValue.birthDate
            } : contact
        )
      ),
      switchMap(contacts =>
        this.http.patch<Contact>(
          `${environment.apiUrl}/contacts/${id}`,
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
