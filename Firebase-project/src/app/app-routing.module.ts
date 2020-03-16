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
import { ReportComponent } from './compare/report/report.component';
import { ProfileComponent } from './profile/profile.component';
import { UsedIconsComponent } from './shared/shared-components/used-icons/used-icons.component';
import { AuthGuardService as AuthGuard} from './login/auth-guard.service';


const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'login'
}, {
  path: 'home',
  component: HomeComponent,
  canActivate: [AuthGuard]
},
{
  path: 'login',
  component: LoginComponent
}, {
  path: 'forum',
  component: ForumComponent,
  canActivate: [AuthGuard]
}, {
  path: 'post',
  component: ForumPostComponent,
  canActivate: [AuthGuard]
},
{
  path: 'profile',
  component: ProfileComponent,
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
      path: 'report',
      component: ReportComponent
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
  redirectTo: 'login'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
