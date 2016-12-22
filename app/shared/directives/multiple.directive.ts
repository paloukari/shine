import { Directive, OnInit, ElementRef, Input, Renderer } from '@angular/core';

@Directive({ selector: '[multiple]' })

export class MultipleDirective implements OnInit {

   @Input('multiple') multipleFlag: boolean;

   constructor(private el: ElementRef, private renderer: Renderer) {
      this.multipleFlag = false;
   }

   ngOnInit() {
      if (this.multipleFlag) {
         this.renderer.setElementAttribute(this.el.nativeElement, 'multiple', '');
      }
   }
}
