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
      ],
      updateOn: "blur"
    });

    this.lastNameCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
      updateOn: "blur"
    });

    this.emailCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.email
      ],
      updateOn: "blur"
    });

    this.birthDateCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
      ],
      updateOn: "blur"
    });

    this.phoneNumberCtrl = this.formBuilder.control('', {
      validators: [
        Validators.required,
      ],
      updateOn: "blur"
    });
  }

  private initMainForm() {
    this.mainForm = this.formBuilder.group({
      firstName : this.firstNameCtrl,
      lastName : this.lastNameCtrl,
      email : this.emailCtrl,
      birthDate: this.birthDateCtrl,
      phoneNumber: this.phoneNumberCtrl
    },
      {
        updateOn: "blur"
      });
  }

  getErrorFormControlMessage(ctrl: AbstractControl) {
    if (ctrl.hasError('required'))
      return "Ce champ est requis";
    else if (ctrl.hasError('email'))
      return "Votre adresse email n'est pas valide";
    else if (ctrl.hasError('minlength'))
      return "Veuillez respecter le format (nombre minimum)";
    else if (ctrl.hasError('maxlength'))
      return "Veuillez respecter le format (nombre maximum)";

    return "Ce champ contient une erreur";
  }

  onCreateNewContact() {
    this.loading = true;
    this.contactService.createNewContact(this.mainForm.value).pipe(
      tap(create => {
        this.loading = false;
        if (create) {
          this.resetForm();
        } else {
          console.log('Error while saving user information');
        }
      })
    ).subscribe({
      next : response => {
        this.dialogRef.close(response);
      }
    });

  }

  private resetForm(): void {
    this.mainForm.reset();
  }

}
