import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {
  transform(timestamp: { seconds: number, nanoseconds: number }): Date {
    const milliseconds = timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1000000);
    return new Date(milliseconds);
  }
}
