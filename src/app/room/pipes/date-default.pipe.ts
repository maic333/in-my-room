import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateDefault'
})
export class DateDefaultPipe implements PipeTransform {

    transform(value: any): any {
        return value ? moment(value).format('YYYY-MM-DD hh:mm') : '';
    }

}
