import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/currentUser.service';

@Component({
  selector: 'app-workspace-navigate',
  templateUrl: './workspace-navigate.component.html',
  styleUrls: ['./workspace-navigate.component.scss']
})
export class WorkspaceNavigateComponent implements OnInit {

  constructor(public userService:UserService) {}

  menuItems = [
    { url: '/workspace', title: 'Заказы', role: 'all', exact: true},
    { url: '/workspace/completed', title: 'Закрытые поставки', role: 'all', exact: false},
    { url: '/workspace/items', title: 'Карточки товаров', role: 'admin', exact: false},
    { url: '/workspace/users', title: 'Пользователи', role: 'admin', exact: false},
    { url: '/workspace/timesheet', title: 'Табель', role: 'admin', exact: false},

  ];

  logout():void {
    this.userService.logout();
    window.location.reload();
  }


  ngOnInit(): void {
  }

}
