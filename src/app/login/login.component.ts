import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;
  @ViewChild(TemplateRef) content: TemplateRef<any>;

  state: 'opened' | 'closed' = 'closed';

  private overlayRef: OverlayRef;
  private portal: TemplatePortal<any>;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

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

      this.overlayRef = this.overlay.create(new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: positionStrategy,
      }));

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
