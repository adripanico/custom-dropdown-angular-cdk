import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => fadeIn', animate('.4s ease'))
    ]),
    trigger('slideContent', [
      state('void', style({ height: 0, opacity: .4 })),
      state('enter', style({ height: '*', opacity: 1 })),
      state('leave', style({ height: 0})),
      transition('* => *', animate('.4s ease')),
    ])
  ],
})
export class LoginComponent {
  @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;
  @ViewChild(TemplateRef) content: TemplateRef<any>;

  animationState: 'void' | 'enter' | 'leave' = 'enter';

  private overlayRef: OverlayRef;
  private portal: TemplatePortal<any>;
  private state: string;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef,
              private breakpointObserver: BreakpointObserver) { }

  open() {
    if (!this.overlayRef) {
      const positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(this._overlayOrigin.elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 0,
        }]);

      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: positionStrategy,
      });

      this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());
      this.portal = new TemplatePortal(this.content, this.viewContainerRef);
      this.state = 'opened';
    }

    this.overlayRef.attach(this.portal);
  }

  close() {
    this.state = 'closed';
    this.overlayRef.detach();
  }

  onSubmit() {
    for (const controlName in this.loginForm.controls) {
      if (this.loginForm.controls.hasOwnProperty(controlName)) {
        console.log(`${controlName} -> ${this.loginForm.controls[controlName].value}`);
      }
    }
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
    this.close();
  }

}
