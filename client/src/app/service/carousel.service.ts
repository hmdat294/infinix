import { ElementRef, Injectable } from '@angular/core';

interface CarouselInstance {
  carouselInner: ElementRef<HTMLDivElement>;
  indicators: NodeListOf<HTMLButtonElement>;
  totalItems: number;
  currentIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private carousels: { [postId: number]: CarouselInstance } = {};

  initCarousel(
    postId: number,
    carouselInner: ElementRef<HTMLDivElement>,
    nextButton: ElementRef<HTMLButtonElement>,
    prevButton: ElementRef<HTMLButtonElement>,
    indicators: NodeListOf<HTMLButtonElement>
  ): void {
    const carouselElement = carouselInner.nativeElement.closest('.carousel') as HTMLElement;
    const items = carouselElement.querySelectorAll('.carousel-item') as NodeListOf<HTMLElement>;
    const totalItems = items.length;

    const instance: CarouselInstance = {
      carouselInner,
      indicators,
      totalItems,
      currentIndex: 0
    };

    this.carousels[postId] = instance;

    nextButton.nativeElement.addEventListener('click', () => {
      instance.currentIndex = (instance.currentIndex + 1) % totalItems;
      this.updateCarousel(instance);
    });

    prevButton.nativeElement.addEventListener('click', () => {
      instance.currentIndex = (instance.currentIndex - 1 + totalItems) % totalItems;
      this.updateCarousel(instance);
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        instance.currentIndex = index;
        this.updateCarousel(instance);
      });
    });

    this.updateCarousel(instance);
  }

  private updateCarousel(instance: CarouselInstance): void {
    instance.carouselInner.nativeElement.style.transform = `translateX(-${instance.currentIndex * 100}%)`;
    instance.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === instance.currentIndex);
    });
  }

  goSlide(postId: number, slideIndex: number): void {
    const instance = this.carousels[postId];
    if (instance && slideIndex >= 0 && slideIndex < instance.totalItems) {
      instance.currentIndex = slideIndex;
      this.updateCarousel(instance);
    }
  }
}
