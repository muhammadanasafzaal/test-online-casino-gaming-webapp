import {Directive, Injector, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigService} from "../../../../@core/services";
import {FragmentData} from "../../../../@core/models";
import {CasinoFilterService} from "../../../../@core/services/app/casino-filter.service";
import {BaseApiService} from "../../../../@core/services/api/base-api.service";
import {Methods} from "../../../../@core/enums";
import {take} from "rxjs/operators";

@Directive()
export class BaseCasinoMenu implements OnInit
{
    @Input('fragmentConfig') fragmentConfig:FragmentData;
    menuItems: any[];
    type:string = 'vertical';
    allGamesCount:number;
    showAllGamesCount: boolean = true;

    configService: ConfigService;
    casinoFilterService:CasinoFilterService;
    apiService:BaseApiService;

    private readonly route:ActivatedRoute;
    private router:Router;

    private prevPath:string;

    constructor(protected injector: Injector)
    {
        this.configService = injector.get(ConfigService);
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.casinoFilterService = injector.get(CasinoFilterService);
        this.apiService = injector.get(BaseApiService);
    }

    ngOnInit(): void
    {
        this.prevPath = this.router.url.split('/')[1];
        this.type = this.fragmentConfig.Config.type;
        this.showAllGamesCount = (this.fragmentConfig && this.fragmentConfig.Config && this.fragmentConfig.Config.showAllGamesCount) ?? true;
        let menus = JSON.parse(JSON.stringify(this.configService.settings.MenuList.find(elem => elem.Type == this.route.snapshot.data['menuType']).Items));
        if(this.fragmentConfig.Config.hasOwnProperty('menus') && Array.isArray(this.fragmentConfig.Config.menus))
        {
            menus = menus.filter(m => this.fragmentConfig.Config.menus.includes(m.Type));
        }
        this.menuItems = menus.map(menu => {
            if(menu.Icon.includes('.'))
                menu.IconSrc = window['debugPath'] + '/assets/images/casino-menu/' + menu.Icon;
            const type = parseInt(menu.Type);
            menu.Id = isNaN(type) ? -1 : type;
            menu.style = this.fragmentConfig.Config.itemStyle;
            menu.Href =  menu.Id === -1 ?  menu.Id : menu.Href;
            return menu;
        });
        this.getAllGames();
    }

    public selectCategory(category, multiselect = false)
    {
        this.casinoFilterService.addCategory(category, multiselect);
        const query = category.Href || 'all-games';
        this.router.navigate([`/${this.prevPath}/` + query]);
    }

    private getAllGames()
    {
        this.apiService.apiRequest({PageSize:10}, undefined, Methods.GET_GAMES, false).pipe(take(1))
            .subscribe(data => {
                if (data.ResponseCode === 0)
                {
                    this.allGamesCount = data.ResponseObject.TotalGamesCount;
                }
            });
    }
}
