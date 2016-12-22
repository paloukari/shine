import { Component, OnInit, Input, OnDestroy, Directive, EventEmitter, ElementRef } from '@angular/core';
import { handsontable } from './handsontable';

declare var Handsontable: Function;



@Component({
   moduleId: module.id,
   selector: 'dynamic-table',
   templateUrl: 'dynamic-table.component.html',
   providers: [handsontable]
})
export class DynamicTableComponent implements OnInit{


   @Input()
   data: Array<any>;

   @Input()
   colHeaders: Array<string>;

   @Input()
   columns: Array<any>;

   @Input()
   colWidths: Array<number>;

   @Input()
   options: any;

   private afterChange(e: any) {
      console.log(e);
   }

   private afterOnCellMouseDown(e: any) {
      console.log(e);
   }

   ngOnInit() {
   }
}
