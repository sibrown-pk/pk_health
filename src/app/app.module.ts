import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PapaParseModule } from 'ngx-papaparse';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LommModule } from './lomm/lomm.module';
import { AppRoutingModule } from './app.routing.module';
import { C_ResponsiveBreakpoints } from './shared/constants/responsive_breakpoints';
import { HscModule } from './hsc/hsc.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PapaParseModule,
    CoreModule.forRoot(C_ResponsiveBreakpoints),
    LommModule,
    HscModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
