import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipsService } from './shared/services/tips.service';
import { Tip } from './shared/interfaces/tip.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public randomTip: Tip;

  constructor(
    private router: Router,
    private tips: TipsService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.randomTip = this.tips.getRandomTip();
    }, 30000);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
