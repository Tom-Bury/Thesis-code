import { Component, OnInit } from '@angular/core';
import { AllUsersService } from '../shared/services/all-users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private allUsersSvc: AllUsersService
  ) { }

  ngOnInit() {
    this.allUsersSvc.getNameOfUser(''); // To make sure this service is already available
  }

}
