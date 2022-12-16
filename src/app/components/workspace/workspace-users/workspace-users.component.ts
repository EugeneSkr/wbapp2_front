import { Component, OnInit, ElementRef } from '@angular/core';
import { iUser, roles } from 'src/app/models/user';
import { UserService } from 'src/app/services/currentUser.service';
import { Router, ActivatedRoute } from '@angular/router';

import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DialogComponent } from '../../dialog/dialog.component';

import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-workspace-users',
  templateUrl: './workspace-users.component.html',
  styleUrls: ['./workspace-users.component.scss']
})
export class WorkspaceUsersComponent implements OnInit {

  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute, private el: ElementRef, private dialog: MatDialog, public helpersService:HelpersService) {
  }

  editUserId:number = 0;
  usersList: iUser[] = [];
  noticeMessage: string = '';
  
  roles:Array<any> = [
    { alias: 'norole',   title: 'не авторизован'},
    { alias: 'admin',    title: 'администратор'},
    { alias: 'operator', title: 'оператор'}
  ]

  //удаление пользователя
  openDialog():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.data = { description: 'Подтверждаете удаление пользователя?', title: 'Удаление' };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if(confirmed){
        this.userService.deleteUser(this.editUserId).subscribe({
          next: 
            (data:any) => {
              if(this.helpersService.isCustomError(data)){
                return;
              }
              this.editUserId = 0;
              this.getUsersList();
              this.noticeMessage = 'Пользователь удалён!';
              this.helpersService.routeParams(this.route);
            }
        })
      }
    });
  }


  //сохранение изменений
  saveUser():void {
    const user:iUser = this.usersList.find((obj:any) => obj.id === this.editUserId) as iUser;
    this.userService.saveEditUser(user).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.getUsersList();
          this.noticeMessage = 'Изменения сохранены!';
        }
    })
  }

  //выбор пользователя для редактирования
  changeEditUser(userId: number):void {
    this.clearErrors();
    this.editUserId = userId;
    this.helpersService.routeParams(this.route, {'editUserId': userId});
  }

  //получение списка пользователей
  getUsersList():void {
    this.clearErrors();
    this.userService.getUsersList().subscribe({
    next: 
      (data:any) => {
          this.usersList = data.usersList.map((obj:any) => {
          let option = this.roles.find((r:any) => obj.role === r.alias)?.title;
          option = `[${option}]`;
          if(obj.banned){
            option += ' [заблокирован]';
          }
          return {...obj, options: option};
        })
      }
    })
  }

  clearErrors():void {
    this.noticeMessage = '';
    this.helpersService.isCustomError();
  }

  ngOnInit():void {
    //проверка гет параметров
    this.route.queryParams.subscribe((params:any) => {
      if(params.editUserId){
        this.editUserId = Number(params.editUserId);
      }
    });

    this.getUsersList();
  }


}
