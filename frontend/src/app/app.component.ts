import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FrontCarouselComponent } from './components/front-carousel/front-carousel.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BrandsComponent } from './components/brands/brands.component';
import { DownCarouselComponent } from './components/down-carousel/down-carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,FooterComponent,
    LoginComponent,RegisterComponent,FrontCarouselComponent,CategoriesComponent,FormsModule,ReactiveFormsModule,
    HttpClientModule,CommonModule, BrandsComponent, DownCarouselComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'frontend';
  isLoggedIn = false;
  message = ''

  constructor(private http : HttpClient){}

  logout():void{
    this.http.post('https://manasmedimart.onrender.com/auth/logout',{},{
      withCredentials: true
    }).subscribe(()=>{
      this.isLoggedIn = false;
    })
  }
}

