import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForumComponent } from './forum/forum.component';
import { CompareComponent } from './compare/compare.component';
import { ForumPostComponent } from './forum-post/forum-post.component';
import { AboutComponent } from './about/about.component';


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
  path: 'compare',
  component: CompareComponent
}, {
  path: 'about',
  component: AboutComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
