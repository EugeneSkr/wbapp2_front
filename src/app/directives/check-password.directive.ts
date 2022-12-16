import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validators} from "@angular/forms";

@Directive({
  selector: '[appCheckPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckPasswordDirective, multi: true }]
})
export class CheckPasswordDirective {

  constructor() { }

  //проверка соответствия паролей в полях
  validate(control: AbstractControl) : ValidationErrors | null {
    if (control && control instanceof FormGroup) {
      let group = control as FormGroup;
      if(group.controls['regPassword'] && group.controls['regPassword2']){
        if(group.controls['regPassword'].value && group.controls['regPassword'].value.length >=6 && group.controls['regPassword2'].value && group.controls['regPassword'].value != group.controls['regPassword2'].value){
          return { 'passwordMismatch': true };
        }
      }
    }
    return null;    
  }

}
