import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, Observable, switchMap, take, tap} from "rxjs";
import {Contact} from "../../contacts/models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  constructor(private http: HttpClient) {}

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get contacts$(): Observable<Contact[]> {
    return this._contacts$.asObservable();
  }

  setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts').pipe(
      tap(contacts => this._contacts$.next(contacts))
    ).subscribe();
  }

  private addContact(data: Contact) {
    const currentContacts = this._contacts$.value;
    const updatedContacts = [...currentContacts, data];
    this._contacts$.next(updatedContacts);
  }

  createNewContact(formValue: {firstName: string, lastName: string, email: string, phoneNumber: string, birthDate: string}): boolean {
    this.contacts$.pipe(
      take(1),
      map(contacts => [...contacts].sort((a, b) => a.id - b.id)),
      map(sortedContacts => sortedContacts[sortedContacts.length - 1]),
      map(previousContact => ({
        ...formValue,
        id: +previousContact.id + 1
      })),
      delay(1000),
      switchMap(contact =>
        this.http.post<Contact>('http://localhost:3000/contacts', contact)
      )
    ).subscribe({
      next: response =>{
        this.addContact(response);
        this.setLoadingStatus(false);

        return true;
      },
      error: err => {

      }
    });

    return false;
  }

  deleteContact(id: number) {
    this.setLoadingStatus(true);
    this.http.delete(`http://localhost:3000/contacts/${id}`).pipe(
      switchMap(() => this.contacts$),
      take(1),
      map(contacts => contacts.filter(contact => contact.id === id)),
      tap(contacts => {
        this._contacts$.next(contacts);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }
}
