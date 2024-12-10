import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private sharedValue = new BehaviorSubject<any>('Default Value');
  sharedValue$ = this.sharedValue.asObservable();

  updateValue(newValue: any) {
    this.sharedValue.next(newValue);
  }

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

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text?.split(' ');
    return words?.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  removeVietnameseTones(str: string): string {
    return str.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[ăâä]/g, "a")
      .replace(/[ưùụũưû]/g, "u")
      .replace(/[êéẹèẽ]/g, "e")
      .replace(/[ôơóòõọ]/g, "o")
      .replace(/[íìịĩi]/g, "i")
      .replace(/[ýỳỵỹy]/g, "y");
  }

}
