import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HscComponent } from './components/hsc/hsc.component';

const routes: Routes = [
  {
    path: 'data-cards', component: HscComponent, data: {
      breadcrumb: 'Data Cards'
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
