import {Component, Injector } from '@angular/core';
import {UserAccountStatmentComponent} from "../../../../../../../@theme/components";
import {DefaultService} from "@core/services";

@Component({
  selector: 'app-account-page-type1-statement',
  templateUrl: './account-page-type1-statement.component.html'
})
export class AccountPageType1StatementComponent extends UserAccountStatmentComponent{

  public accountData: Array<any> = [];

  constructor(public injector: Injector, public defaultService: DefaultService) {
    super(injector);
  }

  async ngOnInit() {
    super.ngOnInit();
    let input = {
      'Controller': 'Client',
      'Method': 'GetClientAccounts',
      'Token': this.userInfo.Token,
      'ClientId': this.userInfo.Id,
      'PartnerId': this.configService.defaultOptions.PartnerId,
      'RequestData': JSON.stringify({
        'ClientId': this.userInfo.Id
      })
    };

    let responseData = await this.defaultService.defaultRequest(input);
    this.accountData = responseData.ResponseObject.Accounts;
  }

}
