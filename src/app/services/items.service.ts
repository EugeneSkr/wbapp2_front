import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Observable } from 'rxjs';
import { iFullItem } from '../models/items';
import { iPageParams } from '../models/pageParams';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient, private constants: Constants) {}

  //загрузка списка товаров
  public getItemsList(itemsParams:iPageParams):Observable<any>{
    return this.http.get(this.constants.BACKEND_URL + '/items/list/', {params: new HttpParams({fromObject: itemsParams as any})});
  }

  //загрузка фото
  public uploadFileToServer(file: any):Observable<any> {
    const formData = new FormData(); 
    formData.append("file", file, file.name);
    return this.http.post(this.constants.BACKEND_URL + '/files/upload/', formData)
  }

  //удаление фото из временной папки
  public deleteTempPhoto(photo:string):Observable<any>{
    return this.http.delete(this.constants.BACKEND_URL + '/files/delete/',  {params: new HttpParams().append('deleteFile', photo)})
  }

  //сохранение товара
  public saveItem(item:iFullItem):Observable<any>{
    return this.http.post(this.constants.BACKEND_URL + '/items/save/', item);
  }

  //загрузка товара
  public getItemById(itemId:number):Observable<any>{
    return this.http.get(this.constants.BACKEND_URL + `/items/info/${itemId}/`);
  }

  //удаление товара
  public deleteItemById(itemId:number):Observable<any>{
    return this.http.delete(this.constants.BACKEND_URL + `/items/delete/${itemId}/`);
  }
}
