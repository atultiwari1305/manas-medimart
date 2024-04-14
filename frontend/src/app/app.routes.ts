import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/footer/footer.component';

export const routes: Routes = [
    { path: '', component:FooterComponent},
    { path: 'login', component:LoginComponent},
    { path: 'register', component:RegisterComponent},
];
