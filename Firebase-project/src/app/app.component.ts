import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  ) {}

  ngOnInit(): void {
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
