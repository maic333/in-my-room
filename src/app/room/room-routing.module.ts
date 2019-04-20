import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as fromPages from './pages';

const routes: Routes = [
  {
    path: ':roomId',
    component: fromPages.RoomComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
