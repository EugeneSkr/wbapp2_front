import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { PrintService } from 'src/app/services/print.service';
import { Constants } from 'src/app/config/constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoadingService } from 'src/app/services/loading.service'; 

@Component({
  selector: 'app-workspace-print',
  templateUrl: './workspace-print.component.html',
  styleUrls: ['./workspace-print.component.scss']
})
export class WorkspacePrintComponent implements OnInit{

  constructor(public loadingService:LoadingService, private printService:PrintService, public constants: Constants, public helpersService:HelpersService, private sanitizer:DomSanitizer, private router: Router, private route: ActivatedRoute) {}

  supplyBarcode:SafeHtml = '';
  supplyId:string = '';

  pickListBySupplyId:string = '';
  pickListId:number = 0;
  pickListCount:number = 0;
  pickListDate: string = '';
  pickListOrders:any = [];

  stickersQR:any = [];
  stickers = '';

  //Штрихкод поставки
  printSupplyBarcode(supplyId:string):void {
    this.printService.printSupplyBarcode(supplyId).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.supplyBarcode = this.sanitizer.bypassSecurityTrustHtml(data.print);
          this.supplyId = supplyId;
        }
    })
  }

  //печать листа подбора
  printPickList(source:string | number):void {
    this.printService.printPickList(source).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.pickListBySupplyId = data.supplyId;
          this.pickListId = data.pickListId;
          this.pickListCount = data.count;
          this.pickListOrders = data.orders;
          this.pickListDate = data.date;
          
          this.pickListOrders = this.pickListOrders.map((obj:any) =>{
            return {...obj, sticker: this.sanitizer.bypassSecurityTrustHtml(obj.sticker)};
          });
        }
    })
  }

  //печать информационных стикеров
  printStickers(source:string | number):void {
    this.printService.printStickers(source).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.stickers = this.constants.SITE_NAME + 'pdf/' + data.stickers;
        }
    })
  }

  //печать стикеров с QR кодами
  printStickersQR(source:string | number):void {
    this.printService.printStickersQR(source).subscribe({
      next:
        (data:any) => {
          if(this.helpersService.isCustomError(data)){
            return;
          }
          this.stickersQR = data.stickers;
          this.stickersQR = this.stickersQR.map((obj:any) =>{
            return {...obj, sticker: this.sanitizer.bypassSecurityTrustHtml(obj.sticker)};
          });
        }
    })
  }

  
  ngOnInit():void {
    //проверка гет параметров
    this.route.queryParams.subscribe((params:any) => {
        if(params.supplyId){
          this.printSupplyBarcode(params.supplyId);
        }

        if(params.pickListBySupplyId){
         this.printPickList(params.pickListBySupplyId);
        }
        if(params.pickListId){
          this.printPickList(params.pickListId);
        }

        if(params.stickersQRBySupplyId){
          this.printStickersQR(params.stickersQRBySupplyId);
        }
        if(params.stickersQRByPickListId){
          this.printStickersQR(params.stickersQRByPickListId);
        }

        if(params.stickersBySupplyId){
          this.printStickers(params.stickersBySupplyId);
        }
        if(params.stickersByPickListId){
          this.printStickers(params.stickersByPickListId);
        }
     }
    );
  }
}
