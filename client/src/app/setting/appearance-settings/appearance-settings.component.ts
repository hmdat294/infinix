import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../service/setting.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.css'
})
export class AppearanceSettingsComponent implements OnInit {

  tabAccordion: string = '';
  theme: string = '';

  constructor(
    private settingService: SettingService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') || 'light';
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  selectTheme(currentTheme: string) {
    localStorage.setItem('theme', currentTheme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', localStorage.getItem('theme') || currentTheme);
  }
}
