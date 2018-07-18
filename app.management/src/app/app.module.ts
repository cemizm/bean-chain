import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {MaterialModule} from './material.module';

import { AppComponent } from './app.component';

import { OverviewComponent } from './views/overview/overview.component';
import { MachineComponent } from './views/machine/machine.component';


const appRoutes: Routes = [
  {path: 'overview', component: OverviewComponent},
  {path: 'machine/:id', component: MachineComponent},
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    MachineComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
