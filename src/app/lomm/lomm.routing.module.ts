import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LommComponent } from './components/lomm/lomm.component';

const routes: Routes = [
  {
    path: 'lomm', component: LommComponent, data: {
      breadcrumb: 'Living Our Mission Measures'
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
