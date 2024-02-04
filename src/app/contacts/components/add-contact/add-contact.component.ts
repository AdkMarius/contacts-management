import {Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../core/services/contact.service";
import {tap} from "rxjs";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  loading: boolean = false;
  isCreate!: boolean;
  firstNameCtrl!: FormControl;
  lastNameCtrl!: FormControl;
  emailCtrl!: FormControl;
  birthDateCtrl!: FormControl;
  phoneNumberCtrl!: FormControl;
  mainForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private contactService: ContactService,
              public dialogRef: MatDialogRef<AddContactComponent>) {}

  ngOnInit(): void {
    this.initFormsControls();
    this.initMainForm();
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

  onCreateNewContact() {
    this.loading = true;
    try {
      this.isCreate = this.contactService.createNewContact(this.mainForm.value);
      this.loading = false;

      if (this.isCreate) {
        this.resetForm();
      }
      else
        console.log('Error while saving user information');
    } catch (e) {
      console.log(e);
    }
  }

  private resetForm(): void {
    this.mainForm.reset();
  }

}
