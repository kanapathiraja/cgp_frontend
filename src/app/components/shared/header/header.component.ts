import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
    ) { }

  user: any;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }


  logout(){
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      this.router.navigate(['/auth/login']);
  }
}
