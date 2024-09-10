import {Directive, HostBinding, Injector, Input, OnDestroy, OnInit, signal, WritableSignal} from "@angular/core";
import {take} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import { Subscription } from "rxjs";
import {BaseApiService} from "../../../../@core/services/api/base-api.service";
import {ConfigService, SaveData} from "../../../../@core/services";
import {MenuType, Methods} from "../../../../@core/enums";
import {getMappedGame} from "../../../../@core/utils";
import {UserLogined} from "../../../../@core/services/app/userLogined.service";
import {FragmentData} from "../../../../@core/models";
import {CasinoFilterService} from "../../../../@core/services/app/casino-filter.service";
import {TranslateService} from "@ngx-translate/core";

@Directive()
export class BaseCasinoCategory implements OnInit, OnDestroy
{
    @Input('fragmentConfig') fragmentConfig:FragmentData;
    @HostBinding("style.order") order:number|string;
    categoryId:number|string;
    categoryName:string;
    games: any[] = [];
    leftGamesCount: number = 0;
    private viewedGamesCount: number = 0;
    leftGamesCountMessage:WritableSignal<string> = signal("");

    protected router:Router;
    protected userLogged:UserLogined;
    protected configService:ConfigService;
    private subscription:Subscription = new Subscription();
    private apiService: BaseApiService;
    private saveData:SaveData;
    protected route:ActivatedRoute;
    private translate:TranslateService;
    casinoFilterService:CasinoFilterService;
    private isFirstTime:boolean = true;
    markForSave:boolean = false;
    isLoading:boolean;

    /*@HostListener('window:scroll', ['$event'])
    onScroll(event)
    {
       this.updateScrollPosition();
    }*/

    constructor(protected injector:Injector)
    {
        this.apiService = injector.get(BaseApiService);
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.configService = injector.get(ConfigService);
        this.userLogged = injector.get(UserLogined);
        this.saveData = injector.get(SaveData);
        this.casinoFilterService = injector.get(CasinoFilterService);
        this.translate = injector.get(TranslateService);
    }

    /*updateScrollPosition()
    {
        const {pageIndex, pageSize} = this.casinoFilterService;
        this.saveData.updateScrollPositionData(false, pageIndex, pageSize);
    }*/


    getGames(filter, concatData = false, autoScroll = null): void
    {
        this.isLoading = true;
        if(filter.CategoryId === -1)
            filter.CategoryId = null;

        this.apiService.apiRequest(filter, undefined, Methods.GET_GAMES, false).pipe(take(1))
            .subscribe(data => {
                if (data.ResponseCode === 0)
                 {
                     const games = data.ResponseObject.Games.map(game => {
                         game.style = this.fragmentConfig.Config.itemStyle;
                         game = getMappedGame(game);
                         return game;
                     });
                     this.games = concatData ? [...this.games, ...games] : games;
                     this.setGamesLeftCount( data.ResponseObject.LeftGamesCount, data.ResponseObject.TotalGamesCount);
                     if(autoScroll)
                     {
                         const p = setTimeout(() =>
                         {
                             window.scrollTo(0, autoScroll.scrollY);
                         });
                     }
                     if(concatData && this.markForSave)
                     {
                         this.markForSave = false;
                         this.saveData.setCasinoGames({games:this.games, count:this.leftGamesCount, totalCount:data.ResponseObject.TotalGamesCount});
                     }
                     else
                     {
                         if(this.fragmentConfig.Config.type === 'filter' || this.fragmentConfig.Config.type === 'search')
                         {
                             this.saveData.deleteCasinoGames();
                         }
                     }
                }
                this.isLoading = false;
            });
    }

    ngOnInit()
    {
        this.order = this.fragmentConfig.Config.style.order;
        this.categoryId = this.fragmentConfig.Config.id;
        if(this.fragmentConfig.Config.type === 'filter' || this.fragmentConfig.Config.type === 'search')
        {
            this.subscription.add(this.casinoFilterService.onFilterChange$.subscribe(filter => {

                const gamesFromCache = this.saveData.getCasinoGames();
                /*Prevent get games from cache*/
                this.isFirstTime = false;
                if(gamesFromCache.games?.length && this.isFirstTime)
                {
                   this.games = [...gamesFromCache.games];
                    this.setGamesLeftCount(gamesFromCache.count, gamesFromCache.totalCount);
                }
                else
                {
                    let req:any;

                    if(filter)
                    {
                        req = {
                            Name:filter.gamePattern,
                            ProviderIds:filter.providers.map(p => p.Id),
                            CategoryId:this.categoryId || filter.categoryId,
                            PageIndex:filter.pageIndex,
                            PageSize:filter.pageSize,
                        }
                    }


                    if(this.fragmentConfig.Config.type === 'search')
                    {
                        const isAll = filter.categoryId === null;
                        if(isAll && filter.providers.length === 0 && !filter.gamePattern)
                        {
                            this.games = [];
                            return;
                        }
                        if(isAll && this.fragmentConfig.Config.hasOwnProperty('categories'))
                        {
                            req.CategoryIds = this.fragmentConfig.Config.categories;
                        }
                    }

                    if(filter.categoryId || filter.categoryId === 0)
                    {
                        this.getCategoryName(filter.categoryId);
                    }
                    else this.getCategoryName(-1);
                    this.getGames(req, filter.concatData);
                }
                this.isFirstTime = false;
            }));
        }
        else
        {
            this.getGames({CategoryId:this.categoryId, PageSize:this.fragmentConfig.Config.count || 100});
        }
        /*this.saveData.currentScrollPosition$.pipe(take(1)).subscribe(data =>
        {

        });*/
    }

    getCategoryName(categoryId)
    {
        if(categoryId === -1)
            this.categoryName = null;
        else
        {
            const category = this.configService.settings.MenuList.find(elem => elem.Type == MenuType.CASINO_MENU).Items.find(el => el.Type == categoryId);
            if(category)
                this.categoryName =  category.Title;
        }
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }

    openGame(typeId, type, openMode = 1)
    {
        localStorage.setItem('opened-url', this.router.url);
    }

    loadMoreItems()
    {
        this.markForSave = true;
        if(this.leftGamesCount)
            this.casinoFilterService.nextPage();
    }

    private setGamesLeftCount(leftCount:number, totalCount:number = 0)
    {
        this.leftGamesCount = leftCount;
        this.viewedGamesCount = totalCount - this.leftGamesCount;
        this.translate.get("Game.LeftGamesCountMessage").subscribe((res: string) => {
            this.leftGamesCountMessage.set(res.replace("{VIEWED_COUNT}", this.viewedGamesCount.toString()).replace("{LEFT_COUNT}", this.leftGamesCount.toString()));
        });
    }
}
