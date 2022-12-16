import { Component, OnInit} from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Constants } from 'src/app/config/constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-workspace-timesheet',
  templateUrl: './workspace-timesheet.component.html',
  styleUrls: ['./workspace-timesheet.component.scss']
})
export class WorkspaceTimesheetComponent implements OnInit {

  constructor(private ordersService: OrdersService, public constants: Constants, private sanitizer:DomSanitizer, private router: Router, private route: ActivatedRoute, public loadingService:LoadingService, public helpersService: HelpersService) { }

  monthes:any = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  date:Date = new Date();
  currentMonth: any = this.date.getMonth() + 1;
  currentYear: any = this.date.getFullYear();
  timeSheet:any = [];

  firstDayInMonth:number = 0;
  numberOfDaysInMonth:number = 0;

  //вывод лет, начиная с 2022 по текущий + 1
  counterForYears():Array<any> {
    let yearsArray: any = [];
    for(let i = 2022; i <= this.date.getFullYear() + 1; i++){
      yearsArray.push(i);
    }
    return yearsArray;
  }

  //вывод дня
  printDay(day:number, userId:number):string {
    const date = `${this.currentYear}-${this.currentMonth}-${day}`;
    const ts = this.timeSheet.find((obj:any) => obj.id === userId);
    if(ts.dates[date]){
      const count = ts.dates[date]['count'];
      const supplyId = ts.dates[date]['supplies'];
      if(count && supplyId){
        return `<span style="font-size:8px; width:10px; height:10px; position:absolute; top:1px; left:1px;">${day}</span><a target="_blank" href="/workspace/completed/?supplyId=${supplyId}" class="btn btn-primary btn-sm">${count}</a>`;
      }
      if(count){
        return `<span style="font-size:8px; width:10px; height:10px; position:absolute; top:1px; left:1px;">${day}</span><a class="btn btn-primary btn-sm">${count}</a>`;
      }
    }
    return day.toString();
  }

  printCell(firstDay:number = 0, userId:number = 0):string {
    if(firstDay){
      return '<td class="th position-relative">' + this.printDay(firstDay, userId) + '</td>';
    }
    return '<td class="th"></td>';
  }

  //вывод месяца с количеством заявок для пользователя в календаре
  printMonth(firstDay:number, userId:number):SafeHtml {
    let str = '<tr>';
      for(let i = 1; i < this.firstDayInMonth; i++){
        str += this.printCell();
      }
      for(let i = this.firstDayInMonth; i <= 7; i++){
        str += this.printCell(firstDay, userId);
        firstDay++;
      }
    str += '</tr>';
    
   
    while(firstDay <= this.numberOfDaysInMonth){
      str += '<tr>';
        for(let i = 1; i <= 7; i++){
          if(firstDay <= this.numberOfDaysInMonth){
            str += this.printCell(firstDay, userId);
          }
          else{
            str += this.printCell();
          }
          firstDay++;
        }
      str += '</tr>';
    }

    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

  // загрузка данных для построения табеля
  getTimeSheet():void {
    this.timeSheet = [];

    //добавляем гет параметры в адресную строку
    this.helpersService.routeParams(this.route, { 'month': this.currentMonth, 'year': this.currentYear});

    this.firstDayInMonth = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    if(!this.firstDayInMonth){
      this.firstDayInMonth = 7;
    }
    this.numberOfDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    this.ordersService.getTimeSheet(this.currentMonth, this.currentYear).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
        
          if(!data.usersTimesheet){
            return;
          }

          this.timeSheet = data.usersTimesheet;            
          for(let i in this.timeSheet){
            if(this.timeSheet[i]['id']){
              this.timeSheet[i]['calendarStr'] = this.printMonth(1, this.timeSheet[i]['id']);
            }
          }
        }
    })
  }

  ngOnInit():void {
    //проверка гет параметров
    this.route.queryParams.subscribe((params:any) => {
       if(params.month){
         this.currentMonth = params.month;
       }
       if(params.year){
         this.currentYear = params.year;
       }
     }
    );
    this.getTimeSheet();
  }
}
