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

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    InputConfigComponent,
    VideoStreamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
