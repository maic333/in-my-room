import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateChat'
})
export class DateChatPipe implements PipeTransform {

  /* tslint:disable-next-line no-any */
  transform(value: any): any {
    return value ? moment(value).format('MMM DD, h:mm') : '';
  }

}
