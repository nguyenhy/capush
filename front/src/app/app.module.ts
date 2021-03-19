import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';


import { HomepageComponent } from './page/homepage/homepage.component';
import { InputConfigComponent } from './component/input-config/input-config.component';
import { VideoStreamComponent } from './component/video-stream/video-stream.component';
import { MaterialModule } from './module/material/material.module';
import { AllSettingComponent } from './component/all-setting/all-setting.component';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PageLayoutComponent } from './component/page-layout/page-layout.component';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    InputConfigComponent,
    VideoStreamComponent,
    AllSettingComponent,
    PageLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
