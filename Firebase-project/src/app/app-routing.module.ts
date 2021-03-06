import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForumComponent } from './forum/forum.component';
import { CompareComponent } from './compare/compare.component';
import { ForumPostComponent } from './forum-post/forum-post.component';
import { AboutComponent } from './about/about.component';
import { VerbruiksverloopComponent } from './compare/verbruiksverloop/verbruiksverloop.component';
import { VergelijkSplitComponent } from './compare/vergelijk-split/vergelijk-split.component';
import { ProfileComponent } from './profile/profile.component';
import { UsedIconsComponent } from './shared/shared-components/used-icons/used-icons.component';
import { AuthGuardService as AuthGuard} from './login/auth-guard.service';
import { StatisticsComponent } from './compare/statistics/statistics.component';
import { DailyTotalComponent } from './compare/daily-total/daily-total.component';
import { ChecklistPageComponent } from './checklist-page/checklist-page.component';


const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}, {
  path: 'home',
  component: HomeComponent,
  canActivate: [AuthGuard]
},
{
  path: 'login',
  component: LoginComponent,
  canActivate: [AuthGuard]
}, {
  path: 'forum',
  component: ForumComponent,
  canActivate: [AuthGuard]
}, {
  path: 'forum/post/:postID',
  component: ForumPostComponent,
  canActivate: [AuthGuard]
},
{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthGuard]
},
{
  path: 'profile/checklist',
  component: ChecklistPageComponent,
  canActivate: [AuthGuard]
},
{
  path: 'compare',
  component: CompareComponent,
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'verbruiksverloop'
    },
    {
      path: 'verbruiksverloop',
      component: VerbruiksverloopComponent
    }, {
      path: 'vergelijk-split',
      component: VergelijkSplitComponent
    }, {
      path: 'daily-totals',
      component: DailyTotalComponent
    }, {
      path: 'statistics',
      component: StatisticsComponent
    }
  ]
}, {
  path: 'about',
  component: AboutComponent,
  canActivate: [AuthGuard]
}, {
  path: 'icons',
  component: UsedIconsComponent,
  canActivate: [AuthGuard]
}, {
  path: '**',
  redirectTo: 'home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
