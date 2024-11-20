import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { AppearanceSettingsComponent } from "./appearance-settings/appearance-settings.component";
import { ShopSettingsComponent } from "./shop-settings/shop-settings.component";
import { SettingService } from '../service/setting.service';


@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, GeneralSettingsComponent, AccountSettingsComponent, AppearanceSettingsComponent, ShopSettingsComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {

  tabSetting: string = 'shop-settings';
  profile_photo: string = '';
  display_name: string = '';

  constructor(
    private authService: AuthService,
    private settingService: SettingService
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {

        this.profile_photo = response.data?.profile.profile_photo;
        this.display_name = response.data?.profile.display_name;
      });

    this.settingService.sharedValue$.subscribe((newValue) => {
      if (newValue.profile_photo)
        this.profile_photo = newValue.profile_photo;
      if (newValue.display_name)
        this.display_name = newValue.display_name;
    });

  }


  tab(tab: string) {
    this.tabSetting = tab;
  }

}
