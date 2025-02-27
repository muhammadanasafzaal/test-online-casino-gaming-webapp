import {Component, Injector, OnInit} from '@angular/core';
import {BaseWithdrawType3Component} from "../../../../../../../../../../@theme/components/common/base_withdraw_payments/base-withdraw-type3/base-withdraw-type3.component";

@Component({
  selector: 'app-withdraw-type3-default',
  templateUrl: './withdraw-type3-default.component.html'
})
export class WithdrawType3DefaultComponent extends BaseWithdrawType3Component {

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onKeyDown(event: any, controlName: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const maxLen = 9;

    if (value.length > maxLen) {
      input.value = value.substr(0, maxLen);
    }

    if (value.length >= 5 && value.indexOf('.') === -1) {
      const newValue = value.replace(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/, (match, p1, p2, p3, p4) => {
        let result = p1;
        if (p2) result += '.' + p2;
        if (p3) result += '.' + p3;
        if (p4) result += '.' + p4;
        return result;
      });
      input.value = newValue;
    }
    this.paymentForm.controls[controlName].setValue(input.value);
  }

  onInput(event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const maxLength = 9;
    const key = event.key;
    if (value.length >= maxLength) {
      event.preventDefault();
    }
  }

  preventKeys(event: KeyboardEvent) {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  inputChanging(event) {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const digits = value.replace(/[^\d.]/g, '');
    const parts = digits.split('.');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 4);
    } else {
      if (value.startsWith('0') && key !== '.') {
        if (value === '0' ) {
          event.preventDefault();
          return;
        }
        const newValue1 = value.slice(1);
        input.value = newValue1;
        event.preventDefault();
        return;
      }
    }
    const newValue = parts.join('.');
    if (newValue !== value) {
      input.value = newValue;
      event.preventDefault();
    }
  }

}
