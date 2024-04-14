import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http : HttpClient,
    private router : Router
  ){}
  ngOnInit(): void {
      this.form = this.formBuilder.group({
        name: '',
        email: '',
        password: '',
      });
  }

  submit(): void{
    let user = this.form.getRawValue;
    console.log(user);
  }  
}