import {AfterViewInit, Component, createNgModule, Injector} from '@angular/core';
import {CommonMainComponent} from '../../common/common-main/common-main.component';
import {AppConfirmComponent} from "../app-confirm/app-confirm.component";
import {Location} from '@angular/common';
import {BaseControllerService} from "@core/services/app/baseController.service";
import {LoaderService, SharedService} from "@core/services";

import {ContentClasses} from "../../../../services/enums/dynamicllyClasses";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs";
import {Controllers, Methods} from "@core/enums";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-app-main',
    templateUrl: './app-main.component.html',
    styleUrls: ['./app-main.component.scss']
})
export class AppMainComponent extends CommonMainComponent implements AfterViewInit {

    public showFooterComponent: boolean = true;

    public contentClassesName: any;
    public headerPropertyName = '--header-panel1-height';
    public rightToLeftOrientation: boolean = false;

    constructor(public injector: Injector,
                private location: Location,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                public baseControllerService: BaseControllerService,
                public loaderService:LoaderService,
                public sharedService: SharedService) {
        super(injector);
    }

    openRegister() {

        this.dialog.open(AppConfirmComponent, {data:{ title: "register",
                message: true}});
    }

    ngOnInit() {
        super.ngOnInit();

        // this.route.snapshot.data.products.items.find(data => {
        //     console.log(data, 'data *** ////');
        // });

        this.checkVisibilityFooter();

        this.location.onUrlChange((x) => {
            this.checkVisibilityFooter();
        });

        this.sharedService.rightToLeftOrientation.subscribe((recponceData) => {
            this.rightToLeftOrientation = recponceData;
        });
        this.openCharacters();
    }

    ngAfterViewInit() {
        this.headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue(this.headerPropertyName), 10);
        this.addScrollListener();
    }

    override async loadComponent():Promise<any>
    {
        const data = await this.getCharacters();
        const characters = data['ResponseObject'];
        window["characters"] = characters;
        if(characters.length > 1)
        {
            const { CharactersModule } = await import('../fragments/characters/characters.module');
            const moduleRef = createNgModule(CharactersModule, this.injector);
            const component = moduleRef.instance.getComponent();
            return component;
        }
        else
        {
            if(characters.length === 1)
            {
                this.baseApiService.apiPost("",{Controller:Controllers.CLIENT, Method:Methods.ADD_CHARACTER_TO_CLIENT, RequestData: characters[0].Id},null).pipe(take(1)).subscribe(data => {
                    let user = this.localStorageService.get("user");
                    user.CharacterId = data['ResponseObject'];
                    this.localStorageService.add("user", user);
                    this.loginService.notifyUpdateCharacter();
                });
            }
            return null;
        }
    }

    async getCharacters()
    {
        return this.baseApiService.apiPost("",{Controller:Controllers.MAIN}, Methods.GET_CHARACTERS, false).toPromise();
    }

    checkVisibilityFooter() {
        let currentUrl = this.router.url;
        currentUrl = currentUrl.substring(currentUrl.indexOf("/") + 1);
        if (currentUrl.includes('/')) {
            currentUrl = currentUrl.substring(0, currentUrl.indexOf('/'));
        }

        let data: Array<any> = this.configService.defaultOptions.FooterVisibility.filter((responseData) => {
            if (responseData.Title == currentUrl) {
                return responseData;
            }
        });

        this.baseControllerService.GetMenu('HeaderPanel2Menu', 'en').then((data1: any) => {
            let panel1MenuItems = data1.filter((item) => {
                const styleTypeItem = item['StyleType'];
                if (this.userLogined.isAuthenticated) {
                    if (JSON.parse(JSON.parse(styleTypeItem)).visibility !== 'loggedOut') {
                        return item;
                    }

                } else {
                    if (JSON.parse(JSON.parse(styleTypeItem)).visibility !== 'loggedIn') {
                        return item;
                    }
                }

            });


            if (data.length > 0)
            {
                const mainContainer = document.getElementById('main-container');
                if (data[0].Type === '1') {
                    this.showFooterComponent = true;
                    if(mainContainer)
                        mainContainer.classList.remove('fullHeight');
                    const el = document.getElementById('default_sectioon');
                    if(el)
                        el.classList.remove('removeFooter');
                } else if (data[0].Type === '2') {
                    this.showFooterComponent = true;
                    if(mainContainer)
                        mainContainer.classList.remove('fullHeight');
                    const el = document.getElementById('default_sectioon');
                    if(el)
                        el.classList.remove('removeFooter');
                } else {
                    this.showFooterComponent = false;
                    this.contentClassesName = (panel1MenuItems.length > 0) ? ContentClasses.Content_Without_Footer_Two_Line_Header : (panel1MenuItems.length == 0) ? ContentClasses.Content_Without_Footer_One_Line_Header : ContentClasses.Content_Without_Footer;
                    if(mainContainer)
                        mainContainer.classList.add('fullHeight');
                    document.getElementById('default_sectioon').classList.add('removeFooter');
                }
            } else {
                this.showFooterComponent = true;
            }
        });

    }
}
