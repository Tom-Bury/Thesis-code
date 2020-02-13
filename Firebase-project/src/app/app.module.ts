import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ForumComponent } from './forum/forum.component';
import { CompareComponent } from './compare/compare.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ForumPostCardComponent } from './forum/forum-post-card/forum-post-card.component';
import { YourPostsCardComponent } from './forum/your-posts-card/your-posts-card.component';
import { LeaderboardComponent } from './forum/leaderboard/leaderboard.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
