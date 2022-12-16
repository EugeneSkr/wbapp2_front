import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AppLoginComponent } from './components/app-login/app-login.component';
import { AppRegistrationComponent } from './components/app-registration/app-registration.component';
import { AppRecoveryComponent } from './components/app-recovery/app-recovery.component';
import { AppWorkspaceComponent } from './components/app-workspace/app-workspace.component';
import { WorkspaceMainComponent } from './components/workspace/workspace-main/workspace-main.component';
import { WorkspaceCompletedComponent } from './components/workspace/workspace-completed/workspace-completed.component';
import { WorkspaceItemsComponent } from './components/workspace/workspace-items/workspace-items.component';
import { WorkspaceUsersComponent } from './components/workspace/workspace-users/workspace-users.component';
import { WorkspaceTimesheetComponent } from './components/workspace/workspace-timesheet/workspace-timesheet.component';
import { WorkspacePrintComponent } from './components/workspace/workspace-print/workspace-print.component';

const routes: Routes = [
  { path: '', component: AppLoginComponent, title: "Wbapp - Авторизация",  canActivate: [AuthGuard]},
  { path: 'login', component: AppLoginComponent, title: "Wbapp - Авторизация",  canActivate: [AuthGuard]},
  { path: 'registration', component: AppRegistrationComponent, title: "Wbapp - Регистрация",  canActivate: [AuthGuard]},
  { path: 'recovery', component: AppRecoveryComponent, title: "Wbapp - Сброс пароля",  canActivate: [AuthGuard]},
  { path: 'workspace', component: AppWorkspaceComponent,  title: "Wbapp - Рабочая область", canActivate: [AuthGuard],
      children: [
        { path: '', component: WorkspaceMainComponent, canActivate: [AuthGuard], title: "Wbapp - Список"},
        { path: 'completed', component: WorkspaceCompletedComponent, canActivate: [AuthGuard], title: "Wbapp - Закрытые поставки"},
        { path: 'users', component: WorkspaceUsersComponent, canActivate: [AuthGuard], title: "Wbapp - Редактирование пользователей"},
        { path: 'items', component: WorkspaceItemsComponent, canActivate: [AuthGuard], title: "Wbapp - Редактирование товаров"},
        { path: 'timesheet', component: WorkspaceTimesheetComponent, canActivate: [AuthGuard], title: "Wbapp - Табель рабочего времени"},
        { path: 'print', component: WorkspacePrintComponent, canActivate: [AuthGuard], title: "Wbapp - Печать"}
      ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
