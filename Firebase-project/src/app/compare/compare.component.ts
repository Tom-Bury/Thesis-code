import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  isOpen = false;

  constructor() { }

  ngOnInit() {
  }


  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
