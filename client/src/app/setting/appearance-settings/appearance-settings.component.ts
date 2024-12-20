import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../service/setting.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appearance-settings',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.css'
})
export class AppearanceSettingsComponent implements OnInit {

  tabAccordion: string = '';
  theme: string = '';
  sound: string = '';

  constructor(
    private settingService: SettingService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') || 'light';

    this.sound = localStorage.getItem('sound') || '';
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  selectTheme(currentTheme: string) {
    localStorage.setItem('theme', currentTheme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', localStorage.getItem('theme') || currentTheme);
  }

  listSounds: any = [
    {
      "filename": "airport-call-157168",
      "name": "Airport Call"
    },
    {
      "filename": "cell-phone-ringing-151762",
      "name": "Cell Phone Ringing"
    },
    {
      "filename": "discord-call-250633",
      "name": "Discord Call"
    },
    {
      "filename": "phone-call-71976",
      "name": "Phone Call"
    },
    {
      "filename": "raven-call-72946",
      "name": "Raven call"
    },
    {
      "filename": "ring-phone-190265",
      "name": "Old Phone Ring"
    },
    {
      "filename": "ringing-151670",
      "name": "Cellphone ringing"
    },
    {
      "filename": "telephone-dial-and-call-ring-21151",
      "name": "Telephone - Dial and call - Ring"
    },
    {
      "filename": "warning-notification-call-184996",
      "name": "Warning Notification Call"
    }
  ];

  switchSound() {
    if (this.sound == '0')
      localStorage.removeItem('sound');
    else
      localStorage.setItem('sound', this.sound);
  }

}
