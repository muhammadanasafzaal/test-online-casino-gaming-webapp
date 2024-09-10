import {Component, Injector, OnInit} from '@angular/core';
import { LayoutService } from '@core/services/app/layout.service';
import {CommonUserDefaultComponent} from "../../../common/common-user-default/common-user-default.component";
import {Router} from "@angular/router";
import {SaveData} from "@core/services";
import {MenuType} from "@core/enums";
import {BaseControllerService} from "@core/services/app/baseController.service";


@Component({
  selector: 'app-mobile-account-page-type1-default',
  templateUrl: './mobile-account-page-type1-default.component.html',
  styleUrls: ['./mobile-account-page-type1-default.component.scss']
})
export class MobileAccountPageType1DefaultComponent extends CommonUserDefaultComponent {
  public router: Router;
  public menuList: Array<any> = [];
  public baseControllerService: BaseControllerService;

  constructor(public injector: Injector, public layoutService: LayoutService) {
    super(injector);
    this.savedDateService = injector.get(SaveData);
    this.router = injector.get(Router);
    this.baseControllerService.GetMenu(MenuType.MOBILE_RIGHT_SIDEBAR, 'en').then((data: any) => {
      const source = JSON.parse(JSON.stringify(data));
      this.menuList = [];
      this.menuList = source.filter((item) => item.Type !== 'submenu');
      this.menuList.forEach(el => {
        el.SubMenu.forEach(subMenuItem => {
          if(this.router.url.includes(subMenuItem.Href)) {
            if(subMenuItem.Href !== '') {
              this.savedDateService.selectedItem = el;
              this.savedDateService.currentSubItem = el;
            }
          }
        });
      });
    });
  }

  ngOnInit() {
  }

}
