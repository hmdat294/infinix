import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

  tabChild(tabAccordion: string, tab: string, el: ElementRef): string {
    const updatedTabAccordion = tabAccordion === tab ? '' : tab;

    const panels = el.nativeElement.querySelectorAll('.accordion-panel') as NodeListOf<HTMLElement>;
    panels.forEach((panel) => {
      if (panel.classList.contains(tab)) {
        if (updatedTabAccordion === tab) {
          const actualHeight = panel.scrollHeight + 'px';
          panel.style.maxHeight = actualHeight;
        } else {
          panel.style.maxHeight = '0';
        }
      } else {
        panel.style.maxHeight = '0';
      }
    });

    return updatedTabAccordion;
  }
}
