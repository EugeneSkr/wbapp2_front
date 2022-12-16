import { Injectable } from '@angular/core';
import { iRegUser, iUser } from '../models/user';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../config/constants';
import { sha256 } from 'js-sha256';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  currentUser: iUser = {
    id: 0,
    fio: '',
    role: 'norole',
    email: '',
    lastName: '',
    name: '',
    sureName: '',
    protected: false
  };

  constructor(private http: HttpClient, private constants: Constants) {}

  public logout():void{
    localStorage.clear();
    window.location.reload();
  }

  //загрузка данных об авторизованном пользователе из локального хранилища
  public loadDataFromStorage():void{
    const tmpUser = localStorage.getItem("current_user");
    if(tmpUser){
      this.currentUser = JSON.parse(tmpUser);
    }
  }

  //подсчёт хэша
  public calcHash(toHash:string = ''):string{
   return sha256(this.currentUser.id + this.constants.SECRET_WORD + toHash);
  }

  //сохранение пользователя в локальное хранилище
  public saveUser(data:iUser):void{
    this.currentUser = data;
    localStorage.removeItem('current_user');
    localStorage.setItem('current_user', JSON.stringify(this.currentUser));
  }

  //сохранение токена
  public saveToken(token: string):void{
    localStorage.removeItem('auth_token');
    localStorage.setItem('auth_token', token);
  }

  //извлечение токена
  public getToken():string | null{
    return localStorage.getItem("auth_token");
  }

  //проверка пользователя
  public checkUser(email:string, password: string):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/auth/sign-in/', { email: email, password: password });
  }

  //регистрация пользователя
  public registerUser(regUser:iRegUser):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/auth/sign-up/', regUser)
  }

  //обновление пользователя и токена
  public refreshUser(token:string | null):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/auth/refresh/', { refreshToken: token});
  }

  //запрос на сброс пароля
  public recoveryPassword(email:string):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/auth/recovery/', { recoveryPasswordEmail: email });
  }

  //сброс пароля
  public changePassword(recoveryData:any = {}):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/auth/changePass/', recoveryData);
  }

  
  //список пользователей
  public getUsersList():Observable<any>{
    return this.http.get(this.constants.BACKEND_URL + '/users/list/');
  }

  //сохранение изменений пользователя
  public saveEditUser(editUser: iUser):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/users/save/',  editUser);
  }

  //удаление пользователя
  public deleteUser(deleteUserId: number):Observable<any>{
    return this.http.delete(this.constants.BACKEND_URL + '/users/delete/' + deleteUserId);
  }
}
