import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(
    // private authService: AuthService,//need to remove this unnessary injection
    private router: Router,
    private configService: ConfigService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log("AuthGuard", route);

    // let urlSegment = route['_urlSegment'];
    // let userRoles = this.configService.getRoles();

    let userDetails = this.configService.getUserDetails();

    if (route.url[0].path == "chat") {
      if (!userDetails) {
        this.router.navigate(['/login']);
        console.log("Login to continue.");
        return false;
      }
    }
    else if (route.url[0].path == "login") {
      if (userDetails) {
        this.router.navigate(['/chat']);
        console.log("Already logged in.");
        return false;
      }
    }

    console.log("URL", route['_routerState'].url);

    return true;
  }
}
