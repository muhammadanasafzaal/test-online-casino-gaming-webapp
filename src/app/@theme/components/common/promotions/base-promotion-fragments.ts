import {OnInit, Injector, Directive, OnDestroy, inject, ViewChild} from '@angular/core';
import {BaseApiService} from "../../../../@core/services/api/base-api.service";
import {Promotion, PromotionFragment} from "../../../../@core/models";
import {Controllers, Methods} from "../../../../@core/enums";
import {Subscription, take} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LangService} from "../../../../@core/services/app/lang.service";
import {UserLogined} from "../../../../@core/services/app/userLogined.service";
import {ConfigService} from "../../../../@core/services";
import {LayoutService} from "../../../../@core/services/app/layout.service";
import {MatDialog} from "@angular/material/dialog";

@Directive()
export class BasePromotionFragments implements OnInit, OnDestroy {

  @ViewChild("sliderComponent") sliderComponent;
  promotionFragments:PromotionFragment[] = [];
  selectedPromotionId:number | string;
  selectedFragmentId:number | string;
  selectedFragment:PromotionFragment;
  filteredFragment:PromotionFragment;
  promotion:Promotion = new Promotion();
  slides:any[] = [];
  private baseApiService:BaseApiService;
  public route: ActivatedRoute;
  public router: Router;
  private http:HttpClient;
  private languageService:LangService;
  private subscription:Subscription = new Subscription();
  protected loginService: UserLogined;
  dialog = inject(MatDialog);
  configService:ConfigService;
  layoutService:LayoutService;


  constructor(public injector: Injector)
  {
    this.baseApiService = injector.get(BaseApiService);
    this.route = injector.get(ActivatedRoute);
    this.http = injector.get(HttpClient);
    this.languageService = injector.get(LangService);
    this.router = injector.get(Router);
    this.loginService = injector.get(UserLogined);
    this.configService = injector.get(ConfigService);
    this.layoutService = injector.get(LayoutService)
  }

  ngOnInit()
  {
    this.getPromotionFragments();
    this.subscription.add(this.route.queryParams.subscribe(param => {
      this.selectedPromotionId = param.id;
      this.selectedFragmentId = param.groupId;
      if(this.selectedPromotionId)
      {
        this.getPromotionById(this.selectedPromotionId)
        .subscribe(data => {
          this.promotion.Content = data.content;

          this.promotion.Title = data.title;
          this.promotion.Description = data.description;
          this.promotion.Id = data.id;
          this.promotion.Date = data.date;
          this.promotion.ImageName = data.image;
          this.promotion.Type = data.type;
          window.scrollTo(0,0);
        });
      }
      if(this.promotionFragments.length)
      {
        this.selectFragmentByPromotionId();
      }
      if(this.selectedFragmentId)
      {
        if(this.promotionFragments.length)
        {
          this.filteredFragment = this.promotionFragments.find(fragment =>  fragment.Id == this.selectedFragmentId);
        }
      }
      else this.filteredFragment = null;
    }));
  }

  getPromotionById(id:number|string)
  {
    return  this.http.get<any>(window['debugPath'] + '/assets/json/promotions/' + id
        + '_' +  this.languageService.currentLangKey + '.json' + '?=' + window['VERSION']);
  }

  getPromotionFragments()
  {
    this.subscription.add(this.baseApiService.apiRequest(undefined, Controllers.MAIN,Methods.GET_PROMOTIONS, false)
        .subscribe(data => {
          if(data.ResponseCode === 0)
          {
            this.promotionFragments = data.ResponseObject.map(f => {
              f.Promotions.forEach(p => {
                if(p.StyleType)
                  p.Style = JSON.parse(p.StyleType);
              });
              if(f.StyleType)
                f.Style = JSON.parse(f.StyleType);
              return f;
            });
            if(this.selectedPromotionId)
            {
              this.selectFragmentByPromotionId();
            }
            if(this.selectedFragmentId)
            {
              this.filteredFragment = this.promotionFragments.find(fragment =>  fragment.Id == this.selectedFragmentId);
            }
          }
        }));
  }

  private selectFragmentByPromotionId()
  {
    this.selectedFragment = null;
    parentLoop:
    for (let i = 0; i < this.promotionFragments.length; i++)
    {
      for (let j = 0; j < this.promotionFragments[i].Promotions.length; j++)
      {
        if(this.selectedPromotionId == this.promotionFragments[i].Promotions[j].Id)
        {
          this.selectedFragment = this.promotionFragments[i];
          if(this.sliderComponent)
          {
            if (this.sliderComponent.initialized)
            {
              this.sliderComponent.unslick();
              this.slides = [];
            }
            setTimeout(() => {
              this.slides = [...this.selectedFragment.Promotions];
              if (!this.sliderComponent.initialized)
                this.sliderComponent.initSlick();
            }, 100);
          }
          break parentLoop;
        }
      }
    }
  }

  onSelectPromotion(promotion:Promotion, fragment:any)
  {
    this.router.navigate(["/promotions"], {queryParams:{id:promotion.Id}});
  }

  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

}