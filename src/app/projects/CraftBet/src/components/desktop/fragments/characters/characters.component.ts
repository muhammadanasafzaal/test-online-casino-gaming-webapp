import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {CircleCarousel, dragger} from "./characters";
import {BaseApiService} from "@core/services/api/base-api.service";
import {Controllers, Methods} from "@core/enums";
import {take} from "rxjs";
import {Character} from "@core/models";
import {LocalStorageService} from "@core/services";
import {UserLogined} from "@core/services/app/userLogined.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.scss']
})

export class CharactersComponent implements OnInit
{
    /*elements:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13];*/
    @Input() Id: string = 'characters';
    @Input() scaleMultiplier: any;
    @Input() radius: any;

    public characters: Array<Character> = [];
    carousel;
    container;
    public selectedCharacterId: number;

    data:any = inject(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<CharactersComponent>);
    public isShowCharactersList: boolean = false;
    public selectedCharacter:any;


    constructor(private baseApiService:BaseApiService,
                private localStorageService:LocalStorageService,
                private loginService:UserLogined,
                private cd:ChangeDetectorRef)
    {

    }

    ngOnInit()
    {
        this.characters =  window["characters"];
        this.cd.detectChanges();
        this.createSlider();
    }

    setCharacterById(characterId)
    {
        if(characterId)
        {
            this.baseApiService.apiPost("",{Controller:Controllers.CLIENT, Method:Methods.ADD_CHARACTER_TO_CLIENT, RequestData: characterId},null).pipe(take(1)).subscribe(data => {
                let user = this.localStorageService.get("user");
                user.CharacterId = data['ResponseObject'];
                this.localStorageService.add("user", user);
                this.loginService.notifyUpdateCharacter();
            });
        }
        this.selectedCharacter = this.characters.find((item) => item.Id === characterId);
    }

    close()
    {
        if(!this.selectedCharacter){
            this.setCharacterById(this.characters[0].Id)
        }
        this.dialogRef.close();
    }

    selectCharacter(characterId)
    {
        this.selectedCharacterId = characterId;
    }

    showCharactersList(){
        this.isShowCharactersList = !this.isShowCharactersList
    }

    leftBtn(){
    this.carousel.rotateToLeft();
    this.carousel.drawElements();
};

    rightBtn(){
    this.carousel.rotateToRight();
    this.carousel.drawElements();
};

    createSlider()
    {
        const { onDrag, onDragEnd } = dragger(window);

        this.carousel = new CircleCarousel(
            document.querySelector(`#${this.Id} > .carousel`), this.radius,
        this.scaleMultiplier);


        onDrag(({ distanceX }) => {
            const r = -distanceX / (this.carousel.radius * (Math.PI / 2));

            this.carousel.rotation = Math.round(r / this.carousel.sA) * this.carousel.sA;
            this.carousel.rotated = r;

            this.carousel.updateItems(r);
        });

        onDragEnd(() => {
            this.carousel.rotate();
        });
    }

    confirm()
    {
        this.dialogRef.close(true);
    }
}

