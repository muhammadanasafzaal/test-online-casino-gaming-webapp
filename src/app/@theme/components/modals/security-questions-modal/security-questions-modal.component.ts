import {Component, EventEmitter, inject, Injector, Input, OnInit, Output} from '@angular/core';
import {Controllers, Methods} from "../../../../@core/enums";
import {take} from "rxjs";
import {BaseApiService} from "../../../../@core/services/api/base-api.service";
import {UtilityService} from "../../../../@core/services/app/utility.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'security-questions-modal',
    templateUrl: './security-questions-modal.component.html',
    styleUrls: ['./security-questions-modal.component.scss']
})
export class SecurityQuestionsModalComponent implements OnInit
{
    @Input('securityQuestionIds') securityQuestionIds:number[] = [];

    @Output('onSecurityConfirmed') onSecurityConfirmed:EventEmitter<any>;
    @Input('isModal') isModal: boolean = false;
    logoUrl: string = '';
    securityQuestions:any[] = [];
    errorMessage:string;
    showMessage = false;
    data:any = inject(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<SecurityQuestionsModalComponent>);

    callBack = (data:any) =>
    {
        if(data.hasOwnProperty('error'))
        this.utilsService.showMessageWithDelay(this, [{ errorMessage: data.error }]);
        else this.dialogRef.close();
    }
    answersData:any[];

    private baseApiService:BaseApiService;
    private utilsService: UtilityService;
    constructor(public injector: Injector)
    {
        this.baseApiService = injector.get(BaseApiService);
        this.utilsService = injector.get(UtilityService);
    }

    ngOnInit()
    {
        this.getSecurityQuestions();
        this.securityQuestionIds = this.data.securityQuestionIds || this.securityQuestionIds;
    }

    errorHandler(event) {
        event.target.src = '../../../../../../../assets/images/logo.png';
    }

    getSecurityQuestions()
    {
        this.baseApiService.apiRequest(null, Controllers.MAIN, Methods.GET_SECURITY_QUESTIONS, false).pipe(take(1)).subscribe(data => {
            const index = Math.floor(Math.random() * this.securityQuestionIds.length);
            this.securityQuestionIds.splice(index, 1);
            this.securityQuestions = data.ResponseObject.filter(el => {
                return this.securityQuestionIds.includes(el.Id);
            });
        });
    }

    submit()
    {
        if(this.getSecurityValidation() && this.showMessage === false)
        {
            this.answersData = this.securityQuestions;
            this.onSecurityConfirmed.emit({securityQuestions: this.answersData, callBack:this.callBack});
        } else {
            this.showMessage = true;
        }
    }

    public getSecurityValidation():boolean
    {
        return this.securityQuestions.every(data => !!data.Answer && data.Answer?.trim());
    }

}
