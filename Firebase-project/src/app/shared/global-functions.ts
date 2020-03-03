import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

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
  const day = momentDate.day();
  const month = momentDate.month();
  const year = momentDate.year();

  return {day, month, year} as NgbDate;
}
