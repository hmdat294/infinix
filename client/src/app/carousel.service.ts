import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  initCarousel(
    carouselInner: ElementRef<HTMLDivElement>,
    nextButton: ElementRef<HTMLButtonElement>,
    prevButton: ElementRef<HTMLButtonElement>,
    indicators: NodeListOf<HTMLButtonElement>
  ): void {

    const carouselElement = carouselInner.nativeElement.closest('.carousel') as HTMLElement;
    const items = carouselElement.querySelectorAll('.carousel-item') as NodeListOf<HTMLElement>;
    const totalItems = items.length;
    let currentIndex = 0;

    function updateCarousel(): void {
      carouselInner.nativeElement.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    nextButton.nativeElement.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });

    prevButton.nativeElement.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    updateCarousel();
  }
}