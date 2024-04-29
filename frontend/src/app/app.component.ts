import { Component, OnInit ,Output, EventEmitter, NgModule} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './components/catalog/catalog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,FooterComponent,
    LoginComponent,RegisterComponent,FormsModule,ReactiveFormsModule,
    HttpClientModule,CommonModule, HomeComponent, CatalogComponent
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

  @Output() scrollToSection = new EventEmitter<string>();
}

