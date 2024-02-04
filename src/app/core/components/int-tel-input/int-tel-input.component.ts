import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-int-tel-input',
  templateUrl: './int-tel-input.component.html',
  styleUrls: ['./int-tel-input.component.scss']
})
export class IntTelInputComponent implements AfterViewInit, OnDestroy {

  @ViewChild('telInput') telInput! : ElementRef;
  @Input() phoneNumber = '';
  @Input() cssClass = 'form-control';
  @Output() phoneNumberChange = new EventEmitter<string>();
  iti!: intlTelInput.Plugin;
  isInvalid = false;
  selectedCountryCode: any;

  constructor(){}

  ngOnInit(){

  }
  ngAfterViewInit(){
    // const input = document.querySelector("#" + this.inputId);
    this.iti = intlTelInput(this.telInput.nativeElement, {
      utilsScript: "assets/scripts/utils.js",
      // initialCountry: "auto",
      nationalMode: false,
      formatOnDisplay: true
    });
    this.selectedCountryCode = this.iti.getSelectedCountryData().dialCode;
  }
  ngOnChanges(changes: SimpleChanges) {

  }
  ngOnDestroy(){
    this.iti.destroy();
  }

  onFocus = () =>{
    if(this.phoneNumber == undefined || this.phoneNumber == ""){
      var getCode = this.iti.getSelectedCountryData().dialCode;
      this.phoneNumber = "+" + getCode;
    }
  }

  onBlur = ()=>{
    this.isInvalid = false;
    if(this.phoneNumber != undefined && this.phoneNumber.trim()){
      if(this.iti.isValidNumber()){
        this.isInvalid = false;
      }
      else{
        this.isInvalid = true;
      }
    }
  }

  onInputKeyPress = (event: KeyboardEvent) =>{
    const allowedChars = /[0-9\+\-\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  formatIntlTelInput() {
    if (typeof intlTelInputUtils !== 'undefined') { // utils are lazy loaded, so must check
      var currentText = this.iti.getNumber(intlTelInputUtils.numberFormat.E164);
      if (typeof currentText === 'string') { // sometimes the currentText is an object :)
        this.iti.setNumber(currentText); // will autoformat because of formatOnDisplay=true
      }
    }
  }

  onPhoneNumberChange = () =>{
    this.selectedCountryCode = this.iti.getSelectedCountryData().dialCode;
    // this.formatIntlTelInput();
    this.phoneNumberChange.emit(this.phoneNumber);
  }
}
