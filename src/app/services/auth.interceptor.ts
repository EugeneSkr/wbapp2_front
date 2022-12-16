import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { UserService } from './currentUser.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { HelpersService } from './helpers.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userService: UserService, private loadingService:LoadingService, private helpersService:HelpersService) { }
    refresh: boolean = false;
    private totalRequests = 0;

    //перехватчик запросов
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.helpersService.isCustomError();
        this.loadingService.setLoading(true);

        let authRequest = request;
        const token = this.userService.getToken();
        //добавляем токен в заголовок при запросах на сервер
        if(token != null) {
            authRequest = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
        }
        return next.handle(authRequest).pipe(
            //если получаем ошибку авторизации, обновляем токен
            catchError((error) => {
                if(error instanceof HttpErrorResponse && error.status === 401) {
                    if(!this.refresh){
                        this.refresh = true;
                        this.userService.refreshUser(token).pipe(
                            switchMap((data:any) => {
                                this.refresh = false;

                                if(data.error){
                                    console.log(data);
                                    return EMPTY;
                                }
                                
                                this.userService.saveUser(data.user);
                                this.userService.saveToken(data.token);
                                
                                authRequest = request.clone({ setHeaders: {Authorization: 'Bearer ' + this.userService.getToken()}});
                                return next.handle(authRequest);
                                
                            }),
                            catchError((error) => {
                                this.refresh = false;
                                if(error instanceof HttpErrorResponse && error.status === 403){
                                    this.userService.logout();
                                }
                                return throwError(() => error);
                            })
                        ).subscribe();
                    }
                }
                if(error instanceof HttpErrorResponse && error.status === 403) {
                    this.userService.logout();
                }
                return throwError(() => error);
            }),
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests === 0) {
                  this.loadingService.setLoading(false);
                }
              }),
        )
    }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];