import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as fromPages from './pages';
import { AuthGuard } from '../core/services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: fromPages.LoginComponent
  },
  {
    path: 'find-room',
    component: fromPages.FindRoomComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
