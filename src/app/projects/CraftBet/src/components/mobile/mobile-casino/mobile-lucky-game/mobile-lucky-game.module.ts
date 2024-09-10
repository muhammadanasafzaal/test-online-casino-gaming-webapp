import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FontAwesomeIcons} from "../../../../../../../@theme/font-awsome/font-awesome-icons";
import {RouterModule} from "@angular/router";
import {MobileLuckyGameComponent} from "./mobile-lucky-game.component";

@NgModule({
  declarations:[MobileLuckyGameComponent],
  exports:[MobileLuckyGameComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        FontAwesomeIcons,
        RouterModule
    ]
})

export class MobileLuckyGameModule
{
  getComponent()
  {
    return MobileLuckyGameComponent;
  }
}
