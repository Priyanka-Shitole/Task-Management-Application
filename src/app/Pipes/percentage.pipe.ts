import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(val) {
    val = val.replace('%', '');
    if (String(val).indexOf('%') === -1) {

      return val + '%';

    } else {
      return val
    }
  }

}
