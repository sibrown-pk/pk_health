import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LommComponent } from './components/lomm/lomm.component';
import { SharedModule } from '../shared/shared.module';
import { LommService } from './services/lomm-service.service';
import { LommRoutingModule } from './lomm.routing.module';

const lommExports = [LommComponent];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LommRoutingModule
  ],
  declarations: [LommComponent],
  providers: [LommService],
  exports: [...lommExports]
})
export class LommModule { }
