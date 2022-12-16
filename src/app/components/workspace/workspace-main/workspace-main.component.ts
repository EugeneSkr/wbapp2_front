import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/currentUser.service';
import { iOrders } from 'src/app/models/orders';
import { Constants } from 'src/app/config/constants';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoadingService } from 'src/app/services/loading.service';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogComponent } from '../../dialog/dialog.component';
import { iOrdersPageParams } from 'src/app/models/pageParams';

@Component({
  selector: 'app-workspace-main',
  templateUrl: './workspace-main.component.html',
  styleUrls: ['./workspace-main.component.scss']
})
export class WorkspaceMainComponent implements OnInit {


  constructor(private ordersService: OrdersService, public userService: UserService, public loadingService:LoadingService, public constants: Constants, public helpersService: HelpersService, private dialog: MatDialog) {}

  ordersPageParams:iOrdersPageParams = {
    sort: '',
    order: '',
    search: '',
    viewType: 'new',
    currentPage: 1,
    checkNewOrders: 1,
    onPage: 100,
    supplyId: '',
    totalPages: 1,
    totalCount: 0,
    totalCountInSuplly: 0
  }

  searchInput:string = '';
  searchInputChanged:Subject<string> = new Subject<string>();

  selectByArticul:string = '';
  selectedOrders:any = [];
  orders:iOrders[] = [];
  pickLists: any = [];

  pickError:string = '';
  currentSupllyId:string = '';


  //поля таблицы заказов
  tableFields:Array<any> = [
    { title: '', sort: '', order: '', active: false, width: 2},
    { title: '№ заказа', sort: 'orderId', order: 'ASC', active: false, width: 5},
    { title: 'Создано', sort: 'dateCreated', order: 'ASC', active: false, width: 5 },
    { title: 'Фото', sort: '', order: '', active: false, width: 5},
    { title: 'Тип', sort: 'type', order: 'ASC', active: false, width: 5 },
    { title: 'Артикул поставщика', sort: 'articul', order: 'ASC', active: false, width: 20 },
    { title: 'Бренд', sort: 'brand', order: 'ASC', active: false, width: 5 },
    { title: 'Размер', sort: 'size', order: 'ASC', active: false, width: 5 },
    { title: 'Наименование', sort: 'title', order: 'ASC', active: false, width: 15 },
    { title: 'Цена', sort: 'convertedPrice', order: 'ASC', active: false, width: 5 },
    { title: 'Куда доставить', sort: '', order: '', active: false, width: 20 },
    { title: 'Время c заказа', sort: '', order: '', active: false, width: 13 }
  ];

  //отбор по выделенному товару
   showSelectOption(articul:string):void {
    this.selectByArticul = '';
    if(this.selectedOrders.length < 1){
      this.selectByArticul = articul.replace(/(<([^>]+)>)/gi, "");
    }
  }

  //выбор заказа
  selectOrder(orderId:number = 0):void {
    let order:iOrders = this.orders.filter(function(f:any) { return f.orderId == orderId })[0];
    this.showSelectOption(order.item.articul);
    if(order.selected){
      order.selected = 0;
      this.selectedOrders = this.selectedOrders.filter(function(f:any) { return f !== order.orderId });
      return;
    }
    order.selected = 1;
    this.selectedOrders.push(order.orderId);
  }

 //смена сортировки и порядка сортировки
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
    this.ordersPageParams.sort = sort;
    this.ordersPageParams.order = order;
    this.getOrders(1);
  }

  //выбор страницы
  changePage(page:number, scroll:boolean = false):void {
    this.ordersPageParams.currentPage = page;
    this.getOrders(page);
    if(scroll){
      window.scrollTo(0, 0);
    }
  }

   //очистка выбора всех элементов
   clearSelection():void {
    this.selectByArticul = '';
    this.selectedOrders = [];
    this.orders = this.orders.map((obj:any) => { return { ...obj, selected: 0 }});
  }

  //отбор заказов по артикулу
  selectByArticulSearch():void {
    if(!this.selectByArticul){
      return;
    }
    this.searchInput = this.selectByArticul;
    this.clearSelection();
    window.scrollTo(0, 0);
    this.searchInputChanged.next(this.searchInput);
  }

  //установка выделения всех элементов на страницы/снятие выделения
  toggleSelect():void {
    const selectedExist:boolean = this.orders.some((obj:any) => obj.selected === 1);
    if(selectedExist){
      this.clearSelection();
      return;
    }
    this.orders = this.orders.map((obj:any) => {
      this.selectedOrders.push(obj.orderId);
      return { ...obj, selected: 1 }
    });
  }

   //смена вида между новыми и собранными заказами
   changeView(view:string):void {
    this.clearSelection();
    this.searchInput = '';
    this.ordersPageParams.search = '';
    this.ordersPageParams.viewType = view;
    this.getOrders();
    window.scrollTo(0, 0);
  }

  //очистка неиспользуемых заказов
  clearUnused():void {
    this.ordersService.clearUnusedOrders().subscribe();
    this.changeView('new');
  }

  //создание поставки
  createNewSupply():void {
    this.ordersService.createNewSupply().subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.currentSupllyId = data.supplyId;
        }
    })
  }

  //закрытие поставки
  closeSupply():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.data = { description: 'Подтверждаете закрытие поставки?', title: 'Закрытие поставки' };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if(confirmed){
        this.ordersService.closeSupply(this.currentSupllyId).subscribe({
          next:
            (data:any) => {
              if(this.helpersService.isCustomError(data)){
                return;
              }
              this.changeView('new');
            }
        })
      }
    });
  }

  //создаём лист подбора
  createPickList():void {
    this.pickError = '';
    if(!this.currentSupllyId){
      this.pickError = 'Создайте поставку!';
      return;
    }
    
    this.ordersService.createPickList(this.currentSupllyId, this.selectedOrders.join(';')).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          window.open('/workspace/print' + '?pickListId=' + data.pickListId, "_blank");
          this.changeView('new');
        }
    })
    
  }

  //загрузка заказов
  getOrders(page:number = 1):void {
    this.ordersPageParams.currentPage = page;
    this.ordersPageParams.supplyId = this.currentSupllyId;
    this.ordersService.getOrdersList(this.ordersPageParams).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.ordersPageParams.totalPages = data.totalPages;
          this.ordersPageParams.totalCount = data.totalCount;
          this.ordersPageParams.totalCountInSuplly = data.totalCountInSuplly;
          this.currentSupllyId = data.currentSupllyId;
          this.ordersPageParams.supplyId = data.currentSupllyId;

          if(data.answer == 'PICK_LISTS'){
            this.pickLists = data.pickLists;
            return;
          }
          
          this.orders = data.orders;
          //установка цены
          this.orders = this.orders.map((obj:any) => {
            return { ...obj, convertedPrice: this.helpersService.price(obj.convertedPrice)}
          });
          //подсветка выбранных заказов
          this.orders = this.orders.map((obj:any) => {
            return this.selectedOrders.find((selectedId:any) => obj.orderId === selectedId) ? {  ...obj, selected: 1 } :  obj;
          });
        }
    })
  }

  ngOnInit():void {
    this.changeSort('articul');

    //поиск по заказам
    this.searchInputChanged.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(
      searchText => {
        if(searchText.length >= 2){
          this.ordersPageParams.search = searchText;
        }
        else{
          this.ordersPageParams.search = '';
        }
        this.getOrders(1);
      }
    );
  }
}
