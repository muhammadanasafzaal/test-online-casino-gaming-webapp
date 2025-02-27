import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../app/config.service';
import {Request} from "@core/models";
import {Controllers, Methods} from "@core/enums";
import {LocalStorageService} from "@core/services/app/localStorage.service";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class GetJackpotService {

    public userData: any;
    public notifyUpdateUserMessages: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private pendingInput:any;

    constructor(private http: HttpClient,
                private localStorageService: LocalStorageService,
                private configService: ConfigService) {
    }

    public getSettings()
    {
        return this.configService.defaultOptions;
    }

    getcasinoGames(input)
    {
        this.userData = this.localStorageService.get("user");
        const {WebApiUrl, PartnerId} = this.configService.defaultOptions;
        input.LanguageId = localStorage.getItem('lang');
        input.Token = this.userData ?  this.userData.Token : "";
        if(this.userData) {
            input.ClientId = this.userData.Id;
        }
        this.pendingInput = input;
        return this.http.post<any>(`${WebApiUrl}/${PartnerId}/api/Main/GetGames`, input);
    }

    /*Remove this function and get client states from tickets services*/
    getClientStates()
    {
        this.userData = this.localStorageService.get("user");
        const {WebApiUrl, PartnerId} = this.getSettings();
        let request = new Request();
        request.Token = this.userData.Token;
        request.ClientId = this.userData.Id;
        request.PartnerId = PartnerId;
        request.Loader = false;
        request.Controller = Controllers.CLIENT;
        request.Method = Methods.GET_CLIENT_STATES;
        this.http.post<any>(`${WebApiUrl}/${PartnerId}/api/Main/ApiRequest`, request).subscribe(data => {
            if (data.ResponseCode == 0)
                this.notifyUpdateUserMessages.next(data.ResponseObject);
        });
    }
}
