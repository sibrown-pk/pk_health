import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HscRoutingModule } from './hsc.routing.module';
import { HscComponent } from './components/hsc/hsc.component';
import { SharedModule } from '../shared/shared.module';

const hscExports = [
  HscComponent
];

@NgModule({
  imports: [
    CommonModule,
    HscRoutingModule,
    SharedModule
  ],
  declarations: [HscComponent],
  exports: [...hscExports]
})
export class HscModule { }
