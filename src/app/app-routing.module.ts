import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: './public/public.module#PublicModule'
  },
  {
    path: 'rooms',
    loadChildren: './room/room.module#RoomModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
