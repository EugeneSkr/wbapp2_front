import { Component, OnInit, ElementRef} from '@angular/core';
import { UserService } from '../../services/currentUser.service';
import { Router } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  
  constructor(private userService: UserService, private router: Router, private el: ElementRef, public helpersService:HelpersService) {}

  //проверка логина и пароля
  checkLogin():void {
    this.userService.checkUser(this.email, this.password).subscribe({
      next: 
        (data:any) => {
          console.log(data);
          if(this.helpersService.isCustomError(data)){
            if(data.error == 'USER_DOESNT_EXIST'){
              this.el.nativeElement.querySelector('#loginEmail').focus()
              return;
            }
            this.el.nativeElement.querySelector('#loginPassword').focus()
            return;
          }
          this.userService.saveUser(data.user);
          this.userService.saveToken(data.token);
          this.router.navigate(['/workspace']);
          return;
        }
    });
  }

  ngOnInit():void {
    
  }
}
