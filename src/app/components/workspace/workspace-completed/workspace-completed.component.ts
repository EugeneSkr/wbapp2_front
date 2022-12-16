import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Constants } from 'src/app/config/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/currentUser.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoadingService } from 'src/app/services/loading.service';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-workspace-completed',
  templateUrl: './workspace-completed.component.html',
  styleUrls: ['./workspace-completed.component.scss']
})
export class WorkspaceCompletedComponent implements OnInit {

  constructor(private ordersService: OrdersService, public constants: Constants, public userService: UserService, private router: Router, private route: ActivatedRoute, public loadingService:LoadingService, public helpersService: HelpersService) { }

  supplyList:any = [];

  searchInput:string = '';
  searchInputChanged:Subject<string> = new Subject<string>();

  supplyPageParams:any = {
    currentPage: 1,
    onPage: 50,
    startDate: '',
    endDate: '',
    totalCount: 0,
    totalPages: 0,
    optionStr: '',
    search: ''
  }

  //смена страниц
  changePage(page:number, scroll:boolean = false):void {
    this.supplyPageParams.currentPage = page;
    this.getSupplies();
    if(scroll){
      window.scrollTo(0, 0);
    }
  }

  //выбор периода
  selectPeriod():void {
    if(this.supplyPageParams.startDate){
      if(this.supplyPageParams.endDate){
        if(this.supplyPageParams.startDate > this.supplyPageParams.endDate){
          const startDate = this.supplyPageParams.startDate;
          this.supplyPageParams.startDate = this.supplyPageParams.endDate;
          this.supplyPageParams.endDate = startDate;
        }
      }
      else{
        this.supplyPageParams.endDate = this.supplyPageParams.startDate;
      }
    }
    else if(this.supplyPageParams.endDate){
      this.supplyPageParams.startDate = this.supplyPageParams.endDate;
    }

    this.clearFilters(false);
  }

   //очистка фильтров
   clearFilters(clearDates:boolean = true):void {
    if(clearDates){
      this.supplyPageParams.startDate = '';
      this.supplyPageParams.endDate = '';
    }
    this.supplyPageParams.currentPage = 1;
    this.supplyPageParams.search = '';
    this.searchInput = '';
    this.getSupplies();
  }

   //загрузка поставок
   getSupplies():void {
    this.ordersService.getSuppliesList(this.supplyPageParams).subscribe({
      next: 
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
              return;
          }
          this.supplyList = data.supplies;
          this.supplyPageParams.totalCount = data.totalCount;
          this.supplyPageParams.totalPages = data.totalPages;
          this.supplyPageParams.optionStr  = data.optionStr;
        }
    })
  }

  ngOnInit(): void {
    this.getSupplies();

    //поиск по поставкам
    this.searchInputChanged.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(
      searchText => {
      if(searchText.length >= 2){
          this.supplyPageParams.search = searchText;
        }
        else{
          this.supplyPageParams.search = '';
        }
        this.supplyPageParams.currentPage = 1;
        this.getSupplies();
      }
    );

    //проверка гет-параметров, поиск по id поставки
    this.route.queryParams.subscribe((params:any) => {
      if(params.supplyId){
        this.searchInput = params.supplyId;
        this.searchInputChanged.next(this.searchInput);
      }
    });

  }

}
