import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { Constants } from 'src/app/config/constants';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true}]
})
export class EmailValidatorDirective implements Validator {
  constructor(private constants: Constants) {}

  //валидация поля адреса электронной почты
  validate(control: AbstractControl) : ValidationErrors | null {
    if(control.value && !control.value.match(this.constants.EMAIL_PATTERN)){
      return { 'emailInvalid': true };
    }
    return null;
  }
}
