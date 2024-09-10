import {RouterModule, Routes} from "@angular/router";
import {EditSecurityQuestionsComponent} from "./edit-security-questions.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ProfileService} from "../../../../../../../@theme/components/profile/service/profile.service";


const routes: Routes = [
    {
        path: '',
        component: EditSecurityQuestionsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterModule.forChild(routes),
        FontAwesomeModule
    ],
    declarations: [
        EditSecurityQuestionsComponent
    ],
    providers:[
        ProfileService
    ]
})

export class EditSecurityQuestionsModule {

}