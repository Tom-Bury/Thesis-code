import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export function animateCSS(element, animationName, callback): void {
  const node = document.querySelector(element);
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') {
      callback();
    }
  }

  node.addEventListener('animationend', handleAnimationEnd);
}


export function toNgbDate(momentDate): NgbDate {
  // https://momentjs.com/docs
  const day = momentDate.date();
  const month = momentDate.month() + 1;
  const year = momentDate.year();

  return new NgbDate(year, month, day);
}


export function ngbDateTimeToApiString(date: NgbDate, time ? : NgbTimeStruct): string {
  // API formats: DD/MM/YYYY   or DD/MM/YYYY-HH:mm
  const dayStr = date.day <= 9 ? '0' + date.day : date.day;
  const monthStr = date.month <= 9 ? '0' + date.month : date.month;
  const dateStr = dayStr + '/' + monthStr + '/' + date.year;

  if (time) {
    const hourStr = time.hour <= 9 ? '0' + time.hour : time.hour;
    const minStr = time.minute <= 9 ? '0' + time.minute : time.minute;
    return dateStr + '-' + hourStr + ':' + minStr;
  } else {
    return dateStr;
  }
}


export const COLORS = {
  $primary: '#fcf75e',
  '$primary-lighter': '#fcfab1',
  '$primary-text': '#323850',

  '$basic-text': '#494949',

  $secondary: '# 323850 ',
  $light: '#f5f5f5',
  $info: '#59C3C3',
  $dark: '#52489C',
  $success: '#40F99B',
  $danger: '#EF233C',
}
