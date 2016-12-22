import {
   HostListener, Component, OnChanges, SimpleChange, Input,
   ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormModel } from './dynamic-form-model';
import { DynamicControlModel } from '../control/dynamic-control-model';
import { TransactionRendererComponent } from '../../renderer/transaction-renderer.component';
import * as _ from 'lodash';


@Component({
   moduleId: module.id,
   selector: 'dynamic-form',
   changeDetection: ChangeDetectionStrategy.OnPush,
   templateUrl: 'dynamic-form.component.html',
})
export class DynamicFormComponent implements OnChanges {

   @Input()
   formModel: DynamicFormModel;

   @Output()
   notify: EventEmitter<{
      form: FormGroup,
      formModel: DynamicFormModel,
      controlModel: DynamicControlModel<any>,
      keyboardEvent: KeyboardEvent
   }> = new EventEmitter<{
      form: FormGroup,
      formModel: DynamicFormModel,
      controlModel: DynamicControlModel<any>,
      keyboardEvent: KeyboardEvent
   }>();


   formGroup: FormGroup;
   controls: DynamicControlModel<any>[];
   caption: string;


   public get width(): number {
      if (this.formModel) {
         return this.formModel.width + 84;
      }
   }

   public get leftOffset(): number {
      if (this.formModel) {
         return this.formModel.leftOffset;
      }
   }

   public get height(): number {
      if (this.formModel) {
         return this.formModel.height + 42;
      }
   }

   constructor(private _app: TransactionRendererComponent, private _builder: FormBuilder, private ref: ChangeDetectorRef) {
   }

   ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      if (changes && changes['formModel'] && changes['formModel'].currentValue) {
         this.controls = [];
         this.caption = '';

         if (!this.formModel) {
            return;
         }
         this.caption = this.formModel.caption;
         this.formModel.populateControls();

         let group: any = {};
         _.forOwn(this.formModel.controls, (value, key) => {
            this.controls.push(value);

            group[key] = value.required ?
               new FormControl(value.value || '', Validators.required) :
               new FormControl(value.value || '');
         });
         this.formGroup = this._builder.group(group);
         this.ref.markForCheck();
      }
   }

   onNotify(controlModel: DynamicControlModel<any>): void {
      this.notify.emit({ form: this.formGroup, formModel: this.formModel, controlModel: controlModel, keyboardEvent: null });
   }


   @HostListener('document:keydown', ['$event'])
   handleKeyboardEvent(event: KeyboardEvent) {

      this.notify.emit({ form: this.formGroup, formModel: this.formModel, controlModel: null, keyboardEvent: event });
   }


   @HostListener('window:resize', ['$event'])
   handleScreenResize(event: Event) {
      if (this.formModel) {
         this.formModel.leftOffset = Math.floor(((<any>event.target).innerWidth - this.width) / 2);

         this.ref.markForCheck();
         if (this._app) {
            this._app.markForCheck();
         }
      }
   }
}
