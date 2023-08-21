import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: string, args?: string): any {
    let amount = value;
    if (!amount) {
      return value;
    }
    amount = new Intl.NumberFormat().format(Number(value.replace(/[^0-9]/g, '')));
    amount = amount.includes('$') ? amount : '$' + amount;
    return amount == '$' || amount == '$0' ? '' : amount;
  }

}
