import {FormControl, FormGroup} from "@angular/forms";

export class Util {

  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach( field => {
      const control = formGroup.get(field);
      if( control instanceof  FormControl ) {
        control.markAsTouched();
      }
      else if( control instanceof FormGroup ) {
        this.validateAllFormFields(control);
      }
    });
  }

}
