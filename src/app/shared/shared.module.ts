import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPrimaryComponent } from './components/card-primary/card-primary.component';
import { CardSecondaryComponent } from './components/card-secondary/card-secondary.component';
import { IframeWrapperComponent } from './components/iframe-wrapper/iframe-wrapper.component';
import { CardFilterPanelComponent } from './components/card-filter-panel/card-filter-panel.component';
import { HttpClientModule } from '@angular/common/http';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { SearchPipe } from './pipes/search.pipe';

const sharedExports = [
  CommonModule,
  CardPrimaryComponent,
  CardSecondaryComponent,
  IframeWrapperComponent,
  CardFilterPanelComponent,
  CardDetailComponent,
  HttpClientModule,
  SearchPipe
];

const sharedServices = [
];
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CardPrimaryComponent,
    CardSecondaryComponent,
    IframeWrapperComponent,
    CardFilterPanelComponent,
    CardDetailComponent,
    SearchPipe
  ],
  providers: [],
  exports: [...sharedExports]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [...sharedServices]
    };
  }
 }
