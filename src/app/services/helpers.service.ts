import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(private router: Router) { }

   
  private customError$$ = new BehaviorSubject<string>('');
  customError$ = this.customError$$.asObservable();

  //счетчик для страниц
  counter(i: number):Array<any>{
    return new Array(i);
  }

  //установка гет параметров в адресной строке
  routeParams(route:ActivatedRoute, paramNames:any = {}):void{
    this.router.navigate(['.'], {
      relativeTo: route,
      queryParams: paramNames,
      queryParamsHandling: ''
    });
  }

  //проверка ошибок
  isCustomError(data:any = {}):boolean {
    if(data.errorText){
      this.customError$$.next(data.errorText);
      return true;
    }
    this.customError$$.next('');
    return false;
  }

  //вывод цены
  price(price:number | string):string{
    if(!price){
      price = 0;
    }
    return ((price as number) / 100).toFixed(2);
  }
}
