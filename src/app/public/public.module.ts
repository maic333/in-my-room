import { NgModule } from '@angular/core';
import pages from './pages';
import { PublicRoutingModule } from './public-routing.module';
import { CommonSharedModule } from '../shared/common-shared/common-shared.module';
import { FormsCommonModule } from '../shared/forms-common/forms-common.module';

@NgModule({
  imports: [
    PublicRoutingModule,
    CommonSharedModule,
    FormsCommonModule
  ],
  declarations: [
    ...pages
  ],
  entryComponents: []
})
export class PublicModule {
}
