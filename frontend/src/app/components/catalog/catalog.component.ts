import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  form: FormGroup;
  medicines: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      description: ''
    });
    this.fetchMedicines();
  }

  fetchMedicines(): void {
    this.http.get<any[]>("https://manasmedimart.onrender.com/auth/medicines", { withCredentials: true })
      .subscribe(data => {
        this.medicines = data;
      });
  }

  submit(): void {
    let medicine = this.form.getRawValue();
    if (medicine.name == '' || medicine.description == '') {
      Swal.fire("Error", 'Please enter all fields', "error");
    } else {
      this.http.post("https://manasmedimart.onrender.com/auth/addMed", medicine, { withCredentials: true })
        .subscribe(() => {
          this.fetchMedicines(); // Fetch medicines after adding a new one
          this.form.reset(); // Reset the form
          Swal.fire("Success", "Medicine added successfully", "success");
        }, (err) => {
          Swal.fire("Error", err.error.message, "error");
        });
    }
  }

  removeMedicine(medicineId: string): void {
    this.http.delete(`https://manasmedimart.onrender.com/auth/medicines/${medicineId}`, { withCredentials: true })
      .subscribe(() => {
        this.fetchMedicines(); // Fetch medicines after removing one
        Swal.fire("Success", "Medicine removed successfully", "success");
      }, (err) => {
        Swal.fire("Error", err.error.message, "error");
      });
  }
}
