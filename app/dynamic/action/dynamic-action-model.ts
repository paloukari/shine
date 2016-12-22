import { FormGroup } from '@angular/forms';
import { DynamicControlModel } from '../../dynamic/control/dynamic-control-model';
import { DynamicFormModel } from '../../dynamic/form/dynamic-form-model';

export class DynamicActionModel {
    constructor(public form: FormGroup,
        public formModel: DynamicFormModel,
        public controlModel: DynamicControlModel<any>,
        public keyboardEvent: KeyboardEvent) {
    }
}
