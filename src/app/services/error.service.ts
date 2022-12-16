import { ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
//отображение ошибок подключения и системных ошибок
export class CustomErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private matSnackBar: MatSnackBar, private zone: NgZone) { }
  handleError(error: Error | HttpErrorResponse) {
    
    if(error instanceof HttpErrorResponse ){
      if(error.status != 401 && error.status != 403){
        this.zone.run(() => {
          this.matSnackBar.open('Ошибка подключения к серверу', 'Закрыть', { duration: 5000, panelClass: ['snackbar2']});
        });
      }
    }
    else{
      this.zone.run(() => {
        this.matSnackBar.open('Ошибка. ' + error.message, 'Закрыть', { duration: 5000, panelClass: ['snackbar2']});
      });
    }
    console.log(error);
  }
}

export const errorServiceProviders = [{ provide: ErrorHandler, useClass: CustomErrorHandler }];