import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Constants } from 'src/app/config/constants';
import { iItem, iFullItem } from 'src/app/models/items';
import { ItemsService } from 'src/app/services/items.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { HelpersService } from 'src/app/services/helpers.service';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogComponent } from '../../dialog/dialog.component';
import { iPageParams } from 'src/app/models/pageParams';

@Component({
  selector: 'app-workspace-items',
  templateUrl: './workspace-items.component.html',
  styleUrls: ['./workspace-items.component.scss']
})
export class WorkspaceItemsComponent implements OnInit {

  constructor(private itemService: ItemsService, public constants: Constants, private router: Router, private route: ActivatedRoute, private el: ElementRef, public loadingService:LoadingService, public helpersService:HelpersService, private dialog: MatDialog) {}


  itemsPageParams:iPageParams = {
    sort: '',
    order: '',
    search: '',
    currentPage: 1,
    onPage: 50,
    totalPages: 1,
    totalCount: 0
  }

  items = <iItem[]>[];

  currentItem = <iFullItem>{};

  editItemId = 0;
  newItem = 0;

  noticeMessage: string = '';
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();

  //новый товар
  addNewItem():void {
    this.newItem = 1;
    this.editItemId = 0;
    this.currentItemInit();
    this.helpersService.routeParams(this.route, {'addNewItem': 1});
  }


  //удаление товара
  deleteItem(delItemId:number):void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.data = { description: 'Подтверждаете удаление товара?', title: 'Удаление' };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if(confirmed){
          this.itemService.deleteItemById(delItemId).subscribe({
            next: 
            (data:any) => {
              window.scrollTo(0, 0);
              if(this.helpersService.isCustomError(data)){
                return;
              }
              this.noticeMessage = 'Товар удалён';
              this.editItemId = 0;
              this.newItem = 0;
              this.getItemsList(1, false);
              this.helpersService.routeParams(this.route);
            }
          })
        }
    });
  }

  //закрытие формы редактирования/создания товара
  cancel():void {
    this.editItemId = 0;
    this.newItem = 0;
    this.helpersService.routeParams(this.route);
  }

  //загрузка фотографии
  onChange(event: any):void {
    this.clearErrors();
    this.itemService.uploadFileToServer(event.target.files[0]).subscribe({
      next: 
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.currentItem.newPhotoList.push(data.files);
          this.el.nativeElement.querySelector('#iFile').value = '';
        }
    });
  }


  //удаление фото
  deleteImg(photo:string, type:string):void {
    if(type == 'current'){
      this.currentItem.photoList = this.currentItem.photoList.filter(function(f:any) { return f !== photo });
      return;
    }
    this.currentItem.newPhotoList = this.currentItem.newPhotoList.filter(function(f:any) { return f !== photo });
    this.itemService.deleteTempPhoto(photo).subscribe({
      next: 
        (data:any) => {
          this.helpersService.isCustomError(data);
        }
    });
  }


  //сохранение нового/редактируемого товара 
  saveItem():void {
    this.clearErrors();
    this.itemService.saveItem(this.currentItem).subscribe({
      next: 
        (data:any) => {
          window.scrollTo(0, 0);
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.noticeMessage = 'Товар сохранён';
          this.editItemId = 0;
          this.newItem = 0;

          this.helpersService.routeParams(this.route);
          this.getItemsList(1, false);
        }
    });
  }

  //загрузка карточки товара для редактирования
  editItem(itemId:number):void {
    this.clearErrors();
    this.itemService.getItemById(itemId).subscribe({
      next:
        (data:any) => {
          window.scrollTo(0, 0);
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.currentItem = data.item;
          if(this.currentItem.costs){
            this.currentItem.costs = this.helpersService.price(this.currentItem.costs);
          }
          this.editItemId = this.currentItem.id;
          this.helpersService.routeParams(this.route, {'editItemId': this.editItemId});
        }
    })
  }

  //поля таблицы товаров
  tableFields:Array<any> = [
    { title: 'Фото', sort: 'photoList', order: 'ASC', active: false, width: 5},
    { title: 'Tип', sort: 'type', order: 'ASC', active: false, width: 10 },
    { title: 'Артикул поставщика', sort: 'articul', order: 'ASC', active: false, width: 20},
    { title: 'Бренд', sort: 'brand', order: 'ASC', active: false, width: 5 },
    { title: 'Размер', sort: 'size', order: 'ASC', active: false, width: 5 },
    { title: 'Наименование', sort: 'title', order: 'ASC', active: false, width: 20 },
    { title: 'Артикул WB', sort: 'articulWB', order: 'ASC', active: false, width: 10 },
    { title: 'chrt_id', sort: 'chrtId', order: 'ASC', active: false, width: 10 },
    { title: 'Штрихкод', sort: 'barcode', order: 'ASC', active: false, width: 10 },
    { title: 'Цена', sort: 'costs', order: 'ASC', active: false, width: 5 },
  ];

  //смена сортировки
  changeSort(sort:string):void {
    let order = 'ASC';
    this.tableFields = this.tableFields.map((obj:any) => {
      if(obj.sort == sort){
        if(obj.active && obj.order == 'ASC'){
          order = 'DESC';
        }
        return { ...obj, active: true, order: order };
      }
      return { ...obj, active: false, order: order }
    });
    this.itemsPageParams.sort = sort;
    this.itemsPageParams.order = order;
    this.getItemsList();
  }

  //выбор страницы
  changePage(page:number, position = 'top'):void {
    this.helpersService.routeParams(this.route, {'page': page});
    this.getItemsList(page);
    if(position == 'bottom'){
      window.scrollTo(0, 0);
    }
  }

  //загрузка списка товаров
  getItemsList(page:number = 1, clear:boolean = true):void {
    if(clear){
      this.clearErrors();
    }
    this.itemsPageParams.currentPage = page;
    this.itemService.getItemsList(this.itemsPageParams).subscribe({
      next: 
        (data:any) => {
          this.items = data.items;
          this.items = this.items.map((obj:any) => {
            return {...obj, costs: this.helpersService.price(obj.costs) }
          });
          this.itemsPageParams.totalPages = data.totalPages;
          this.itemsPageParams.totalCount = data.totalCount;
        }
    })
  }

  //очистка текущего элемента
  currentItemInit():void {
    this.currentItem = { id: 0, articul: '', articulWb: '', title: '', shortTitle: '', brand: '', type: '', color: '', size: '', barcode: '', chrtId: 0, costs: 0, photo: '', photoList: [], newPhotoList: [],stickerSize: '', stickerContains: '', stickerManufacturer: '', stickerCountry: '', stickerAddress: ''};
  }

  //очистка ошибок
  clearErrors():void{
    this.helpersService.isCustomError();
    this.noticeMessage = '';
  }

  ngOnInit():void {
    this.currentItemInit();
    if(!this.newItem && !this.editItemId){
      this.changeSort('brand');
    }

     //проверка гет параметров
     this.route.queryParams.subscribe((params:any) => {
        if(params.addNewItem){
          this.newItem = 1;
        }
        if(params.editItemId){
          this.editItemId = params.editItemId;
          this.editItem(this.editItemId);
        }
        if(params.page){
          this.changePage(params.page);
        }
      }
    );

    //поиск по товарам
    this.searchInputChanged.pipe(
        debounceTime(700),
        distinctUntilChanged()
      ).subscribe(
        searchText => {
          if(searchText.length >= 2){
            this.itemsPageParams.search = searchText;
          }
          else{
            this.itemsPageParams.search = '';
          }
          this.getItemsList();
        }
      );
    }
}
