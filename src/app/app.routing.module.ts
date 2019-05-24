import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'information-to-insight', pathMatch: 'full' },
  {
    path: 'information-to-insight', component: LandingPageComponent, data: {
      breadcrumb: 'Information to Insight'
    }
  },
  {
    path: 'lomm', loadChildren: './lomm/lomm.module#LommModule'
  },
  {
    path: 'hsc', loadChildren: './hsc/hsc.module#HscModule'
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
