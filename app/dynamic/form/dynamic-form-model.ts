import { NodeWrapper } from '../../parser/transaction/node-wrapper';
import { Form } from '../../parser/transaction/form';
import { DynamicControlModel } from '../control/dynamic-control-model';
import { DynamicTextboxModel } from '../control/dynamic-textbox-model';
import { DynamicLabelModel } from '../control/dynamic-label-model';
import { DynamicButtonModel } from '../control/dynamic-button-model';
import { DynamicDropdownModel } from '../control/dynamic-dropdown-model';
import { DynamicTableModel } from '../control/dynamic-table-model';
import { DynamicCheckboxModel } from '../control/dynamic-checkbox-model';
import { DynamicStatusMessageModel } from '../control/dynamic-status-message-model';
import { rootInjector } from '../../main';
import { ConfigService } from '../../services/config.service';

import * as _ from 'lodash';


export class DynamicFormModel {
   private static _keyId: number = 0;
   private _formControls: NodeWrapper[];
   public height: number;
   public width: number;
   public leftOffset: number;
   public _height: number;
   public _width: number;

   public controls: {
      [key: string]: DynamicControlModel<any>;
   };

   constructor(
      public form: Form,
      options: {
      } = {}) {
      this._formControls = form.controls;

      let config = rootInjector.get(ConfigService) as ConfigService;
      this._height = +config.settings.screenWidth;
      this._width = +config.settings.screenHeight;
   }

   public dispose() {

   }
   public get caption(): string {
      let caption = (this.form.node.attributes['caption'] as Attr);
      return caption ? caption.value : '';
   }


   populateControls() {
      let controls = this._formControls;
      let newControls: {
         [key: string]: DynamicControlModel<any>;
      } = {};
      if (!controls) {
         return;
      }
      controls.forEach(control => {
         switch (control.type) {
            case 'textbox':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicTextboxModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'label':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicLabelModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'button':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicButtonModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'combobox':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicDropdownModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'listbox':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicDropdownModel(control, {
                  key: DynamicFormModel._keyId++,
                  isListBox: true
               });
               break;
            case 'grid':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicTableModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'checkbox':
               newControls[(control.attributes['name'] as Attr).value] = new DynamicCheckboxModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case 'statusmessage':
               newControls['statusmessage'] = new DynamicStatusMessageModel(control, {
                  key: DynamicFormModel._keyId++,
               });
               break;
            case '#text':
               break;

            default:
               throw Error('unknown control type : ' + control.type);
         }
      });
      this.width = Math.max(this._width, _.max(_.map(newControls, e => Number(e.width) + Number(e.left))));
      this.height = Math.max(this._height, _.max(_.map(newControls, e => Number(e.height) + Number(e.top))));

      this.leftOffset = (window.innerWidth - this.width) / 2;

      this.controls = newControls;
   }
}
