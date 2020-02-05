import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.services';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIC APP';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor (
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
    ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url
  }
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit () {
    this._userService.login(this.user).subscribe(
      response => {
        let res:any = response;
        let identity = res.user;
        this.identity = identity;

        if (!this.identity){
          alert("user is not logged in succesfully");
        } else {
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this._userService.login(this.user, 'true').subscribe(
            response => {
              let res:any = response;
              let token = res.token;
              this.token = token;
                    
              if (this.token.length <= 0){
                alert("token was not created succesfully");
              } else {
                localStorage.setItem('token', this.token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              if (error != null){
                this.errorMessage=error.error.message;
              }
            }
          );
        }
      },
      error => {
        if (error != null){
          this.errorMessage=error.error.message
        }
      }
    );
  }
  onSubmitRegister() {
    this._userService.register(this.user_register).subscribe(response => {
      let res:any = response;
      let user = res.user;
      this.user_register = user;

      if (!user._id){
        alert("error signing up");
      } else {
        this.alertRegister = "user signed up succesfully";
        this.user_register = new User('','','','','','ROLE_USER','');
      }
    },
    error =>{
      if (error != null){
        this.alertRegister=error.error.message;
      }
    });
  }
  logout () {
    this.identity = null
    this.token = null
    localStorage.clear()
    this._router.navigate(['/'])
  }
}
