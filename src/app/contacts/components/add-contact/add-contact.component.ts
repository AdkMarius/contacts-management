import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../core/services/contact.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Contact} from "../../models/contact.model";
import {tap} from "rxjs";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  loading: boolean = false;
  isOkay!: boolean;
  firstNameCtrl!: FormControl;
  lastNameCtrl!: FormControl;
  emailCtrl!: FormControl;
  birthDateCtrl!: FormControl;
  phoneNumberCtrl!: FormControl;
  mainForm!: FormGroup;
  isNew!: boolean;

  constructor(private formBuilder: FormBuilder,
              private contactService: ContactService,
              @Inject(MAT_DIALOG_DATA) public data: Contact) {}

  ngOnInit(): void {
    if (!this.data) {
      this.initFormsControls();
      this.initMainForm();
      this.isNew = true;
    } else {
      this.editContact();
      this.isNew = false;
    }
  }

  private initFormsControls() {
    this.firstNameCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    });

    this.lastNameCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    });

    this.emailCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.email
      ]
    });

    this.birthDateCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
      ]
    });

    this.phoneNumberCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
      ]
    });
  }

  private initMainForm() {
    this.mainForm = this.formBuilder.group({
      firstName : this.firstNameCtrl,
      lastName : this.lastNameCtrl,
      email : this.emailCtrl,
      birthDate: this.birthDateCtrl,
      phoneNumber: this.phoneNumberCtrl
    })
  }

  getErrorFormControlMessage(ctrl: AbstractControl) {
    if (ctrl.hasError('required'))
      return "Ce champ est requis";
    else if (ctrl.hasError('email'))
      return "Votre adresse email n'est pas valide";
    else if (ctrl.hasError('minlength'))
      return "Le numero de telephone contient moins de chiffres";
    else if (ctrl.hasError('maxlength'))
      return "Le numero de telephone contient trop de chiffres";

    return "";
  }

  private resetForm(): void {
    this.mainForm.reset();
  }

  editContact() {
    this.firstNameCtrl = this.formBuilder.control(this.data.firstName, {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    });
    this.lastNameCtrl = this.formBuilder.control(this.data.lastName, {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    });
    this.emailCtrl = this.formBuilder.control(this.data.email, {
      validators: [
        Validators.required,
        Validators.email
      ]
    });
    this.phoneNumberCtrl = this.formBuilder.control(this.data.phoneNumber, {
      validators: [
        Validators.required,
      ]
    });
    this.birthDateCtrl = this.formBuilder.control(this.data.birthDate, {
      validators: [
        Validators.required,
      ]
    });

    this.mainForm = this.formBuilder.group({
      firstName : this.firstNameCtrl,
      lastName : this.lastNameCtrl,
      email : this.emailCtrl,
      birthDate: this.birthDateCtrl,
      phoneNumber: this.phoneNumberCtrl
    })
  }

  onValideContact() {
    if (this.isNew)
      this.onCreateNewContact();
    else
      this.onEditContact();
  }

  onCreateNewContact() {
    this.loading = true;
    this.contactService.createNewContact(this.mainForm.value).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.contactService.addContact(saved);
          this.resetForm();
        }
        else
          console.log('Error while saving user information');
      })
    ).subscribe();
  }

  private onEditContact() {
    this.loading = true;
    this.contactService.editContact(this.data.id, this.mainForm.value).pipe(
      tap(edited => {
        this.loading = false;
        if (edited) {
          this.contactService.editData(edited);
          this.resetForm();
        } else {
          console.log('Error while editing user information');
        }
      })
    ).subscribe();
  }
}
