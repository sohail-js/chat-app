import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ConfigService } from '../../services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  registerObj = {};
  loginObj = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.registerObj).then(res => {
      console.log("Registration success");
      this.registerObj = {};
    });
  }

  login() {
    this.authService.login(this.loginObj).then((res: any) => {
      console.log("Login success", res);
      this.configService.setUserDetails(res.data);
      this.router.navigate(['/chat']);
    });
  }
}
