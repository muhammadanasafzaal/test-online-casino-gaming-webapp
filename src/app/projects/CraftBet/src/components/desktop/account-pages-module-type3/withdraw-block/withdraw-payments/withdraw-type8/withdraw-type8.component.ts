import {Component, Injector} from '@angular/core';
import {BaseCreateDynamicComponent} from "../../../../../../../../../@theme/components/common/base-create-dynamic/base-create-dynamic.component";
import {WithdrawType8DefaultComponent} from './withdraw-type8-default/withdraw-type8-default.component';

@Component({
  selector: 'app-withdraw-type8',
  template: `<template #loadChildComponent></template>`
})
export class WithdrawType8Component extends BaseCreateDynamicComponent {

  constructor(public injector: Injector) {
    super(injector);

  }

  ngOnInit() {
    super.ngOnInit();
  }

  createSubComponent(Id: number, ContentType: number, info:number[], maxMinAmount?: any) {
    super.createSubComponent(Id, ContentType, info, maxMinAmount);
    switch (Id) {
      default: {
        this.componentRef = this.entry.createComponent(WithdrawType8DefaultComponent);
        this.componentRef.instance.paymentSystemId = Id;
        this.componentRef.instance.contentType = ContentType;
        this.componentRef.instance.nominals = info;
        this.componentRef.instance.maxMinAmount = maxMinAmount;
        break;
      }
    }
  }

}
