import { Component, OnInit, ElementRef} from '@angular/core';
import { UserService } from '../../services/currentUser.service';
import { iRegUser } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-app-registration',
  templateUrl: './app-registration.component.html',
  styleUrls: ['./app-registration.component.scss']
})
export class AppRegistrationComponent implements OnInit {

  regUser:iRegUser = {
    email: '',
    password: '',
    password2: '',
    lastName: '',
    name: '',
    sureName: '',
    protected: false
  }

  constructor(private userService: UserService, private router: Router, private el: ElementRef, public helpersService:HelpersService) {}

  //регистрация пользователя
  checkRegistration():void {
    this.userService.registerUser(this.regUser).subscribe({
      next: 
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            this.el.nativeElement.querySelector('#regEmail').focus()
            return;
          }
          this.userService.saveUser(data.user);
          this.userService.saveToken(data.token);
          this.router.navigate(['/workspace']);
        }
    });
  }

  ngOnInit():void {
  }

}
