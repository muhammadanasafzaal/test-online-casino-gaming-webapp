import {Component, inject, OnInit} from '@angular/core';
import {SaveData} from "@core/services";
import {ConfigService} from "@core/services";
import {SharedService} from "@core/services";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-app-confirm',
  templateUrl: './app-confirm.component.html',
  styleUrls: ['./app-confirm.component.scss']
})
export class AppConfirmComponent implements OnInit {
  data:any = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AppConfirmComponent>);
  public changeWidth: boolean = false;
  public showLogin: boolean = false;
  public modalMaxHeight: any;
  public topSize: number;
  public popupWidthName: string;
  public rightToLeftOrientation: boolean = false;

  public showRegister: boolean = false;

  public defaultOption: any;

  constructor(public saveData: SaveData, public configService: ConfigService, public sharedService: SharedService) {

  }

  ngOnInit() {

    this.sharedService.rightToLeftOrientation.subscribe((recponceData) => {
      this.rightToLeftOrientation = recponceData;
    });

    this.topSize = window.innerHeight * 3 / 20;
    this.modalMaxHeight = `${(window.innerHeight - window.innerHeight / 5)}px`;
    if (this.data.title === 'open_login') {
      this.showLogin = true;
      this.popupWidthName = 'login_PSection';
    } else {
      this.showLogin = false;
      this.popupWidthName = 'register_PSection';
    }

    this.saveData.clickForgotPassword.subscribe((data) => {
      if (data === '1') {
        this.close();
      }
    });

    this.defaultOption = this.configService.defaultOptions;

    if ((this.defaultOption.QuickRegisterType.length > 0) || (this.defaultOption.RegisterType.length > 0)) {
      this.showRegister = true;
    } else {
      this.showRegister = false;
    }

  }

  redirectPage(boolProperty) {
    if (boolProperty) {
      this.showLogin = true;
      this.popupWidthName = 'login_PSection';
    } else {
      this.showLogin = false;
      this.popupWidthName = 'register_PSection';
    }
  }

  close()
  {
    this.dialogRef.close();
  }

}
