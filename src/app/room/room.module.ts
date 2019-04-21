import { NgModule } from '@angular/core';
import pages from './pages';
import components from './components';
import { RoomRoutingModule } from './room-routing.module';
import { CommonSharedModule } from '../shared/common-shared/common-shared.module';
import { FormsCommonModule } from '../shared/forms-common/forms-common.module';

@NgModule({
    imports: [
      RoomRoutingModule,
      CommonSharedModule,
      FormsCommonModule
    ],
    declarations: [
      ...pages,
      ...components,
    ],
    entryComponents: []
})
export class RoomModule {
}
