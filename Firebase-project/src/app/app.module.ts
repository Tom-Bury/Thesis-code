import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';
import {
  NgbDatepickerModule,
  NgbTimepickerModule
} from '@ng-bootstrap/ng-bootstrap';

// FontAwesome
import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faThumbsUp,
  faComment,
  faPlus,
  faPlusCircle,
  faPlusSquare,
  faMinusCircle,
  faMinusSquare,
  faMinus,
  faChevronCircleLeft,
  faHome,
  faComments,
  faChartLine,
  faChartArea,
  faQuestionCircle,
  faQuestion,
  faAt,
  faDatabase,
  faHourglassEnd,
  faTasks,
  faTrophy,
  faTimes,
  faTimesCircle,
  faCalendarAlt,
  faArrowRight,
  faExclamationTriangle,
  faArrowLeft,
  faHamburger,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as faoThumbsUp,
  faComment as faoComment
} from '@fortawesome/free-regular-svg-icons';

import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';
import {
  environment
} from '../environments/environment';
import {
  LoginComponent
} from './login/login.component';
import {
  HomeComponent
} from './home/home.component';
import {
  ForumComponent
} from './forum/forum.component';
import {
  CompareComponent
} from './compare/compare.component';
import {
  ProfileComponent
} from './profile/profile.component';
import {
  AboutComponent
} from './about/about.component';
import {
  NavbarComponent
} from './navbar/navbar.component';
import {
  ForumPostCardComponent
} from './forum/forum-post-card/forum-post-card.component';
import {
  YourPostsCardComponent
} from './forum/your-posts-card/your-posts-card.component';
import {
  LeaderboardComponent
} from './forum/leaderboard/leaderboard.component';
import {
  ForumBarComponent
} from './forum/forum-bar/forum-bar.component';
import {
  ForumPostComponent
} from './forum-post/forum-post.component';
import {
  CommentComponent
} from './forum-post/comment/comment.component';
import {
  VerbruiksverloopComponent
} from './compare/verbruiksverloop/verbruiksverloop.component';
import {
  VergelijkSplitComponent
} from './compare/vergelijk-split/vergelijk-split.component';
import {
  VergelijkDuaalComponent
} from './compare/vergelijk-duaal/vergelijk-duaal.component';
import {
  ReportComponent
} from './compare/report/report.component';
import {
  AvatarComponentComponent
} from './shared/shared-components/avatar-component/avatar-component.component';
import {
  PointsBadgeComponent
} from './shared/shared-components/points-badge/points-badge.component';
import {
  SidebarComponent
} from './navbar/sidebar/sidebar.component';
import {
  UsedIconsComponent
} from './shared/shared-components/used-icons/used-icons.component';
import {
  ChecklistComponent
} from './shared/shared-components/checklist/checklist.component';
import {
  AchievementsComponent
} from './profile/achievements/achievements.component';
import {
  SummaryComponent
} from './home/summary/summary.component';
import {
  SocialCountComponent
} from './shared/shared-components/social-count/social-count.component';
import {
  HttpErrorInterceptor
} from './shared/http-error.interceptor';
import {
  DateTimeRangePickerComponent
} from './shared/shared-components/date-time-range-picker/date-time-range-picker.component';
import {
  TimePickerComponent
} from './shared/shared-components/date-time-range-picker/time-picker/time-picker.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SpinnerComponent } from './shared/shared-components/spinner/spinner.component';


import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartComponent } from './compare/report/bar-chart/bar-chart.component';
import { FloatingActionButtonComponent } from './shared/shared-components/floating-action-button/floating-action-button.component';


const usedIcons = [
  faSearch, faThumbsUp, faComment, faPlus, faPlusCircle, faPlusSquare,
  faMinus, faMinusCircle, faMinusSquare, faChevronCircleLeft, faHome, faComments,
  faChartLine, faChartArea, faQuestionCircle, faQuestion, faAt, faDatabase, faHourglassEnd,
  faTasks, faTrophy, faTimes, faoThumbsUp, faoComment, faTimesCircle, faCalendarAlt, faArrowRight,
  faArrowLeft, faExclamationTriangle, faBars
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ForumComponent,
    CompareComponent,
    ProfileComponent,
    AboutComponent,
    NavbarComponent,
    ForumPostCardComponent,
    YourPostsCardComponent,
    LeaderboardComponent,
    ForumBarComponent,
    ForumPostComponent,
    CommentComponent,
    VerbruiksverloopComponent,
    VergelijkSplitComponent,
    VergelijkDuaalComponent,
    ReportComponent,
    AvatarComponentComponent,
    PointsBadgeComponent,
    SidebarComponent,
    UsedIconsComponent,
    ChecklistComponent,
    AchievementsComponent,
    SummaryComponent,
    SocialCountComponent,
    DateTimeRangePickerComponent,
    TimePickerComponent,
    SpinnerComponent,
    BarChartComponent,
    FloatingActionButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FontAwesomeModule,
    NgApexchartsModule,
    HttpClientModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  providers: [{
    provide: 'allIcons',
    useValue: usedIcons
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})


export class AppModule {

  // Add used fontAwesome icons --> https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/usage/icon-library.md
  constructor(library: FaIconLibrary) {
    usedIcons.forEach(i => library.addIcons(i));
  }
}
