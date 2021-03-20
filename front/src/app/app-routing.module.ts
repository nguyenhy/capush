import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component';
import { InputOutputComponent } from './page/input-output/input-output.component';
import { SettingsComponent } from './page/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'input-output', component: InputOutputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
