import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {BaseVerifyCode} from '../../register/types/base-verify-code.';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'common-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  encapsulation:ViewEncapsulation.None,
  /*providers:[
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ]*/
})
export class VerifyCodeComponent extends BaseVerifyCode {
  public logoUrl: string = '../../../../../../../assets/images/' + window.location.hostname + '.png';
  constructor(public injector: Injector) {
    super(injector);
  }

  close() {
    this.dialogRef.close();
  }
}
