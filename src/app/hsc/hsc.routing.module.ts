import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HscComponent } from './components/hsc/hsc.component';

const routes: Routes = [
  {
    path: 'hsc', component: HscComponent, data: {
      breadcrumb: 'Hospital Scorecard'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})

export class HscRoutingModule { }
