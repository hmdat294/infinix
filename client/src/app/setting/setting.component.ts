import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { AppearanceSettingsComponent } from "./appearance-settings/appearance-settings.component";


@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, GeneralSettingsComponent, AccountSettingsComponent, AppearanceSettingsComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {

  tabSetting: string = 'general-settings';

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {

  }

  tab(tab: string) {
    this.tabSetting = tab;
  }

}
