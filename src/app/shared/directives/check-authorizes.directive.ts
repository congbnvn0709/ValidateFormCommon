import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthUtilsService } from '../utilities/auth.utils.service';

@Directive({
  selector: '[vtCheckAuthorizes]'
})
export class CheckAuthorizesDirective {

  private authorities: string[] = [];
  private authenticationSubscription?: Subscription;

  constructor(
    private authUtilsService: AuthUtilsService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input()
  set vtCheckAuthorizes(roles: string[]) {
    // this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView(roles);
    // Get notified each time authentication state changes.
    // this.authenticationSubscription = this.accountService.getAuthenticationState().subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }
  }

  private updateView(roles: string[]): void {
    const hasAnyAuthority = this.authUtilsService.checkUserHaveAnyRole(roles) //this.accountService.hasAnyAuthority(this.authorities);
    this.viewContainerRef.clear();
    if (hasAnyAuthority) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
