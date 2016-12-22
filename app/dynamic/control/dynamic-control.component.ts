import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DynamicControlModel } from './dynamic-control-model';
import { FormGroup } from '@angular/forms';


@Component({
   moduleId: module.id,
   selector: 'dynamic-control',
   templateUrl: 'dynamic-control.component.html'
})
export class DynamicControlComponent implements OnInit {

   @Input()
   controlData: DynamicControlModel<any>;

   @Input()
   formGroup: FormGroup;

   @Input()
   leftOffset: number;

   @Output()
   notify: EventEmitter<DynamicControlModel<any>> = new EventEmitter<DynamicControlModel<any>>();

   constructor() {
   }

   ngOnInit() {
   }

   get isValid(): boolean {
      return this.formGroup.controls[this.controlData.name].valid;
   }

   onClick(event: Event): any {
      this.notify.emit(this.controlData);
   }

   onChange(value: any): any {
      if (this.controlData.controlType === 'dropdown') {
         this.controlData.value = value as number;
      }
   }
}
