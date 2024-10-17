import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-default',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header-default.component.html',
  styleUrl: './header-default.component.css'
})
export class HeaderDefaultComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 50;
  }

}
