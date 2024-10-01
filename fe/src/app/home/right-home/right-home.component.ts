import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-right-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './right-home.component.html',
  styleUrl: './right-home.component.css'
})
export class RightHomeComponent implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {

    this.accordion();

  }

  accordion() {
    const headers = this.el.nativeElement.querySelectorAll('.a-accordion-header') as NodeListOf<HTMLElement>;

    headers.forEach((header: HTMLElement) => {
      this.renderer.listen(header, 'click', () => {
        const panel = header.nextElementSibling as HTMLElement;

        header.classList.toggle('active');
        panel.classList.toggle('open');

        panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
      });
    });
  }
}
