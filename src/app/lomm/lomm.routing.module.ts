import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LommComponent } from './components/lomm/lomm.component';

const routes: Routes = [
  {
    path: 'performance', component: LommComponent, data: {
      breadcrumb: 'Performance'
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

export class LommRoutingModule { }
