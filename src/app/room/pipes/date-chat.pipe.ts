import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateChat'
})
export class DateChatPipe implements PipeTransform {

    transform(value: any): any {
        return value ? moment(value).format('MMM DD, h:mm') : '';
    }

}
