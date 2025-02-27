import {Component, Injector} from '@angular/core';
import {AppCommonAnnouncementComponent} from "../../../common/app-common-announcement/app-common-announcement.component";

@Component({
  selector: 'app-mobile-account-page-type2-announcements',
  templateUrl: './mobile-account-page-type2-announcements.component.html'
})
export class MobileAccountPageType2AnnouncementsComponent extends AppCommonAnnouncementComponent {

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
