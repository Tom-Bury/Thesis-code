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
import { VergelijkDuaalComponent } from './compare/vergelijk-duaal/vergelijk-duaal.component';
import { ReportComponent } from './compare/report/report.component';
import { ProfileComponent } from './profile/profile.component';
import { ChecklistComponent } from './navbar/checklist/checklist.component';


const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}, {
  path: 'home',
  component: HomeComponent
},
{
  path: 'login',
  component: LoginComponent
}, {
  path: 'forum',
  component: ForumComponent
}, {
  path: 'post',
  component: ForumPostComponent
},
{
  path: 'profile',
  component: ProfileComponent
},
{
  path: 'compare',
  component: CompareComponent,
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
      path: 'vergelijk-duaal',
      component: VergelijkDuaalComponent
    }, {
      path: 'report',
      component: ReportComponent
    }
  ]
}, {
  path: 'about',
  component: AboutComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
