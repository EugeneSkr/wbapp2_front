import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/currentUser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //обновление роли
    if(!this.userService.currentUser.id){
      this.userService.loadDataFromStorage();
      if(this.userService.currentUser.id && this.userService.currentUser.role == 'norole'){
        this.userService.refreshUser(this.userService.getToken()).subscribe({
          next: 
            data => {
              this.userService.saveUser((data as any).user);
              this.userService.saveToken((data as any).token);
            }
        });
      }
    }

    const url = state.url.split('/');
    const mainUrl = url[1];
    const childUrl = url[2];
    
    
    if(mainUrl == 'workspace'){
      if(this.userService.currentUser.id){
        //ограничения для просмотра определенных страниц не администраторам
        if((childUrl == 'users' || childUrl == 'items' || childUrl == 'timesheet') && this.userService.currentUser.role != 'admin'){
          this.router.navigate(['/workspace']);
          return false;
        }
        else if(childUrl && this.userService.currentUser.role == 'norole'){
          this.router.navigate(['/workspace']);
          return false;
        }
        return true;
      }
      
      this.router.navigate(['/login']);
      return false;
      
    }
    //авторизованного пользователя перемещаем в воркспейс
    else if(!mainUrl || mainUrl == 'login' || mainUrl == 'registration'  || mainUrl.indexOf('recovery') !== -1){
      if(this.userService.currentUser.id){
        this.router.navigate(['/workspace']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
  
}
