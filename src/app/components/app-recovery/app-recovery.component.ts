import { Component, OnInit, ElementRef} from '@angular/core';
import { UserService } from '../../services/currentUser.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-app-recovery',
  templateUrl: './app-recovery.component.html',
  styleUrls: ['./app-recovery.component.scss']
})
export class AppRecoveryComponent implements OnInit {

  constructor(private userService: UserService, private el: ElementRef, private router: Router, private route: ActivatedRoute, public helpersService:HelpersService) {

  }

  changePasswordStep: number = 0;
  rEmail: string = '';

  recoveryData:any = {
    recoveryId: 0,
    userEmail: '',
    hash: '',
    newpass: '',
    newpass2: ''
  }


  checkRecovery():void {
    //проверка адреса почты и отправка письма со ссылкой на сброс пароля
    if(this.changePasswordStep === 0){
      this.userService.recoveryPassword(this.rEmail).subscribe({
        next:
          (data:any) => {
            if(this.helpersService.isCustomError(data)){
              this.el.nativeElement.querySelector('#recoveryEmail').focus();
              return;
            }
            this.changePasswordStep = 1;
          }
      });
    }
    //сохранение нового пароля
    if(this.changePasswordStep === 2){
      this.userService.changePassword(this.recoveryData).subscribe({
        next:
          (data:any) => {
            if(this.helpersService.isCustomError(data)){
              return;
            }
            this.changePasswordStep = 3;
          }
      });
    }
  }

  ngOnInit():void {
    // просмотр получаемых гет параметров и подготовка к смене пароля
    this.route.queryParams.subscribe((params:any) => {
        if(params.recoveryId && params.recoveryEmail && params.recoveryHash){
          this.recoveryData.recoveryId = params.recoveryId;
          this.recoveryData.userEmail = params.recoveryEmail;
          this.recoveryData.hash = params.recoveryHash;

          this.changePasswordStep = 2;
        }
      }
    );
  }
}
