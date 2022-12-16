import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EmailValidator, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from './config/constants';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoginComponent } from './components/app-login/app-login.component';
import { AppRecoveryComponent } from './components/app-recovery/app-recovery.component';
import { AppWorkspaceComponent } from './components/app-workspace/app-workspace.component';
import { WorkspaceUsersComponent } from './components/workspace/workspace-users/workspace-users.component';
import { WorkspaceItemsComponent } from './components/workspace/workspace-items/workspace-items.component';
import { WorkspaceMainComponent } from './components/workspace/workspace-main/workspace-main.component';
import { WorkspaceCompletedComponent } from './components/workspace/workspace-completed/workspace-completed.component';
import { WorkspaceTimesheetComponent } from './components/workspace/workspace-timesheet/workspace-timesheet.component';
import { WorkspaceNavigateComponent } from './components/workspace/workspace-navigate/workspace-navigate.component';
import { AppRegistrationComponent } from './components/app-registration/app-registration.component';


import { authInterceptorProviders } from './services/auth.interceptor';
import { LoadingService } from './services/loading.service';
import { errorServiceProviders } from './services/error.service';
import { UserService } from './services/currentUser.service';
import { ItemsService } from './services/items.service';
import { OrdersService } from './services/orders.service'; 
import { PrintService } from './services/print.service'; 
import { HelpersService } from './services/helpers.service';
import { HighlightDirective } from './directives/highlight.directive';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { CheckPasswordDirective } from './directives/check-password.directive';


import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { WorkspacePrintComponent } from './components/workspace/workspace-print/workspace-print.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppRecoveryComponent,
    AppWorkspaceComponent,
    WorkspaceUsersComponent,
    WorkspaceItemsComponent,
    WorkspaceMainComponent,
    WorkspaceCompletedComponent,
    WorkspaceTimesheetComponent,
    WorkspaceNavigateComponent,
    AppRegistrationComponent,
    EmailValidatorDirective,
    CheckPasswordDirective,
    HighlightDirective,
    DialogComponent,
    WorkspacePrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [ UserService, PrintService, Constants, EmailValidator, HighlightDirective, CheckPasswordDirective, authInterceptorProviders, errorServiceProviders, LoadingService, HelpersService, ItemsService, OrdersService],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
