import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material/material.module';

import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusUpdateComponent } from './status-update/status-update.component';

@NgModule({
  declarations: [
    AuthComponent,
    DashboardComponent,
    PageNotFoundComponent,
    StatusUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    StatusUpdateComponent
  ]
})
export class CoreModule { }
