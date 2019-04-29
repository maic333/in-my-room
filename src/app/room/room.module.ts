import { NgModule } from '@angular/core';
import pages from './pages';
import components from './components';
import pipes from './pipes';
import { RoomRoutingModule } from './room-routing.module';
import { CommonSharedModule } from '../shared/common-shared/common-shared.module';
import { FormsCommonModule } from '../shared/forms-common/forms-common.module';
import * as fromServices from './services';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    RoomRoutingModule,
    CommonSharedModule,
    FormsCommonModule,
    MatTooltipModule
  ],
  declarations: [
    ...pages,
    ...components,
    ...pipes,
  ],
  providers: [
    ...fromServices.services
  ],
  entryComponents: []
})
export class RoomModule {
}
