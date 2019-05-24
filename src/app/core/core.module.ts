import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from './components/banner/banner.component';
import { HeaderComponent } from './components/header/header.component';
import { DataService } from './services/data.service';
import { NotificationService } from './services/notification.service';
import { BreakpointService } from './services/breakpoint.service';
import { IBreakpointConfig } from '../shared/interfaces/IBreakpoint';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AppFilterComponent } from './components/app-filter/app-filter.component';
import { AppFilterAddInComponent } from './components/app-filter/app-filter-add-in/app-filter-add-in.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { NavBreadcrumbsComponent } from './components/nav-breadcrumbs/nav-breadcrumbs.component';
import { SharedModule } from '../shared/shared.module';

const moduleExports = [
  SideNavComponent,
  BannerComponent,
  HeaderComponent,
  LandingPageComponent,
  AppFilterComponent,
  AppFilterAddInComponent,
  TopNavComponent,
  NavBreadcrumbsComponent
];
const coreServices = [
  DataService,
  NotificationService
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    DataService,
    NotificationService,
    BreakpointService
  ],
  exports: [...moduleExports],
  declarations: [
    SideNavComponent,
    BannerComponent,
    HeaderComponent,
    LandingPageComponent,
    AppFilterComponent,
    AppFilterAddInComponent,
    TopNavComponent,
    NavBreadcrumbsComponent
  ]
})
export class CoreModule {
  static forRoot(config: IBreakpointConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ...coreServices,
        { provide: BreakpointService, useClass: BreakpointService, useValue: config }
      ],
    };
  }


}
