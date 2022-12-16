import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient, private constants: Constants) { }

    //печать ШК поставки
    public printSupplyBarcode(supplyId:string):Observable<any>{
      return this.http.post(this.constants.BACKEND_URL + '/print/supply/', { supplyId: supplyId });
    }

    //печать листа подбора
    public printPickList(source:string | number):Observable<any>{
      return this.http.post(this.constants.BACKEND_URL + '/print/picklist/', { source: source });
    }

    //печать информационных стикеров
    public printStickers(source:string | number):Observable<any>{
      return this.http.post(this.constants.BACKEND_URL + '/print/stickers/', {  source: source });
    }

    //печать стикеров QR кодов
    public printStickersQR(source:string | number):Observable<any>{
      return this.http.post(this.constants.BACKEND_URL + '/print/stickersQR/', { source: source });
    }

}
