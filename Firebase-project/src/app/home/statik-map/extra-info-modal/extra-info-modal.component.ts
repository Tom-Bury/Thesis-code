import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-extra-info-modal',
  templateUrl: './extra-info-modal.component.html',
  styleUrls: ['./extra-info-modal.component.scss']
})
export class ExtraInfoModalComponent implements OnInit {

  @ViewChild('extraInfoModal') extraInfoModal: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  public openModal(): void {
    $(this.extraInfoModal.nativeElement).modal('show');
  }

}
