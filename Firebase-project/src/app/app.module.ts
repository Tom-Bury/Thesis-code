import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';

import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';

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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import {
  AngularFireModule
} from '@angular/fire';
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
import { VerbruiksverloopComponent } from './compare/verbruiksverloop/verbruiksverloop.component';
import { VergelijkSplitComponent } from './compare/vergelijk-split/vergelijk-split.component';
import { VergelijkDuaalComponent } from './compare/vergelijk-duaal/vergelijk-duaal.component';
import { ReportComponent } from './compare/report/report.component';
import { AvatarComponentComponent } from './shared/shared-components/avatar-component/avatar-component.component';
import { PointsBadgeComponent } from './shared/shared-components/points-badge/points-badge.component';
import { SidebarComponent } from './navbar/sidebar/sidebar.component';
import { UsedIconsComponent } from './shared/shared-components/used-icons/used-icons.component';
import { ChecklistComponent } from './shared/shared-components/checklist/checklist.component';
import { AchievementsComponent } from './profile/achievements/achievements.component';
import { SummaryComponent } from './home/summary/summary.component';


const usedIcons = [
  faSearch, faThumbsUp, faComment, faPlus, faPlusCircle, faPlusSquare,
  faMinus, faMinusCircle, faMinusSquare, faChevronCircleLeft, faHome, faComments,
  faChartLine, faChartArea, faQuestionCircle, faQuestion, faAt, faDatabase, faHourglassEnd,
  faTasks, faTrophy, faTimes];

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FontAwesomeModule
  ],
  providers: [{
    provide: 'allIcons',
    useValue: usedIcons
  }],
  bootstrap: [AppComponent]
})
export class AppModule {



  // Add used fontAwesome icons --> https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/usage/icon-library.md
  constructor(library: FaIconLibrary) {
    usedIcons.forEach(i => library.addIcons(i));
  }
}
