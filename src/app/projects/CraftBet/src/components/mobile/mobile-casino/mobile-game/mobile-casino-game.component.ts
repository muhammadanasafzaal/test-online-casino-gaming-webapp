import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseApiService } from '../../../../../../../@core/services/api/base-api.service';
import { ProductIno } from '../../../../../../../@core/models';
import { Methods } from '../../../../../../../@core/enums';
import { take } from 'rxjs/operators';
import { ConfigService, LocalStorageService, SaveData } from '../../../../../../../@core/services';
import { FavoritesService } from '../../../../../../../@core/services/api/favorites.service';

@Component({
    selector: 'app-mobile-casino-game',
    templateUrl: './mobile-casino-game.component.html',
    styleUrls: ['./mobile-casino-game.component.scss'],
})
export class MobileCasinoGameComponent implements OnInit {
    @Input() game: any;
    @Input() fragmentConfig;
    @Input() classes = '';
    @Input() selectedProductId: number;
    showInfobox = false;
    productInfo: ProductIno;
    currencySymbol: string;

    @Output('onOpen') onOpen: EventEmitter<any> = new EventEmitter<any>();
    @Output('selectProductId') selectProductId: EventEmitter<any> = new EventEmitter<any>();

    private user;

    constructor(
        private localStorageService: LocalStorageService,
        private saveData: SaveData,
        private baseApiService: BaseApiService,
        private favoriteService: FavoritesService,
        public configService: ConfigService) {
    }

    ngOnInit() {
        this.user = this.localStorageService.get('user');
        this.currencySymbol = this.user ? this.user.CurrencySymbol : '';
        this.productInfo = new ProductIno();
    }

    toggleFavorite(game: any) {
        this.game = game;
        if (this.user) {
            this.favoriteService.toggleFavorite(this.game);
        } else {
            this.saveData.openPopup.next('1');
        }
    }

    toggleInfo(productId?: number): void {
        this.showInfobox = !this.showInfobox;
        if (this.showInfobox && productId) {
            this.getPartnerProductInfo(productId);
        }
    }

    public openGame(game, type) {
        this.onOpen.emit({ game: game, type: type });
    }

    public chooseGame() {
        this.selectProductId.emit(this.game.productId);
    }

    private getPartnerProductInfo(productId: number) {
        this.baseApiService.apiRequest({ ProductId: productId }, '', Methods.GET_PARTNER_PRODUCT_INFO, false)
            .pipe(take(1))
            .subscribe(data => {
                if (data.ResponseCode === 0) {
                    this.productInfo = data.ResponseObject;
                }
            });
    }
    
}
