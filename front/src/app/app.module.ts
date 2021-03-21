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
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PageLayoutComponent } from './component/page-layout/page-layout.component';
import { SettingsComponent } from './page/settings/settings.component';
import { InputOutputComponent } from './page/input-output/input-output.component';
import { InputMediaComponent } from './component/input-config/input-device/input-device.component';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    InputConfigComponent,
    VideoStreamComponent,
    PageLayoutComponent,
    SettingsComponent,
    InputOutputComponent,
    InputMediaComponent
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
