import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVND',
  standalone: true
})
export class CurrencyVNDPipe implements PipeTransform {

  transform(value: number): string {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' đ';
  }

}
