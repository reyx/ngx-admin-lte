import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  /* tslint:disable */
  selector: '.userBox',
  /* tslint:enable */
  styleUrls: ['./user-box.component.css'],
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {
  // default user, only an example, please use the userService to modify
  public currentUser: User = new User({
    avatarUrl: '',
    email: '',
    firstname: '',
    lastname: '',
  });

  constructor(private userServ: UserService, private router: Router) {
    // se connecter au modif du user courant
    this.userServ
      .getCurrent()
      .subscribe((user: User) => (this.currentUser = user));
  }

  public ngOnInit() {
    // TODO
  }

  public logout(): void {
    this.userServ.logout();
  }

  public profile(): void {
    this.userServ.profile();
  }
}
