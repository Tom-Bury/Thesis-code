import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForumComponent } from './forum/forum.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent,
  pathMatch: 'full'
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'forum',
  component: ForumComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
