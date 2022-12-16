import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Observable } from 'rxjs';
import { iOrdersPageParams, iSupplyPageParams } from '../models/pageParams';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private constants: Constants) { }

  //загрузка заказов
  public getOrdersList(ordersParams:iOrdersPageParams):Observable<any>{
    return this.http.get(this.constants.BACKEND_URL + '/orders/list/', {params: new HttpParams({fromObject: ordersParams as any})});
  }

  //очистка неиспользуемых заказов
  public clearUnusedOrders():Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/orders/clear/', {});
  }

  //создание поставки
  public createNewSupply():Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/orders/supplies/open/', {});
  }

  //закрытие поставки
  public closeSupply(supplyId:string):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/orders/supplies/close/', {});
  }

  //создание листа подбора
  public createPickList(supplyId:string, selectedOrders: string):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/orders/supplies/picklist',  { selectedOrders: selectedOrders});
  }

  //список закрытых поставок
  public getSuppliesList(suppliesParams:iSupplyPageParams):Observable<any>{
    return this.http.get(this.constants.BACKEND_URL  + '/supplies/list/', {params: new HttpParams({fromObject: suppliesParams as any})});
  }

  //вывод табеля
  public getTimeSheet(month:number, year:number):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/timesheet/', { month: month, year: year});
  }

}
