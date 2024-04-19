import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  form:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private http: HttpClient,
    private router:Router
  ){}

  ngOnInit():void{
    this.form=this.formBuilder.group({
      email:'',
      password:'',
    })
  }

  ValidateEmail = (email:any)=>{
    var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(email.match(validRegex)){
      return true;
    }
    else{
      return false;
    }
  }
  submit(): void{
    let user = this.form.getRawValue()
    console.log(user);
    if(user.email =='' || user.password==''){
      Swal.fire("Error",'Please enter all fields',"error")
    }
    else if(!this.ValidateEmail(user.email)){
      Swal.fire("Error","Please enter valid email address","error");
    }
    else{
      this.http.post("https://manasmedimart.onrender.com/auth/login",user,{
        withCredentials: true
      }).subscribe(
        (res)=> this.router.navigate(['/']),
        (err)=>{Swal.fire("error",err.error.message,"error")
      })    
    }
  }
}
