import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: LandingPageComponent, data: {
      breadcrumb: 'My Health Records'
    }
  },
  {
    path: 'performance', loadChildren: './lomm/lomm.module#LommModule'
  },
  {
    path: 'data-cards', loadChildren: './hsc/hsc.module#HscModule'
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
