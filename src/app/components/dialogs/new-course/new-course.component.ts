import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NewCourseServiceService } from './new-course-service.service';

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.css'
})
export class NewCourseComponent implements OnInit {
  form: FormGroup;
  newCourseSubscription: Subscription = new Subscription;
  existError: boolean = false;

  constructor(private fb: FormBuilder,
    private newCourseDialogService: NewCourseServiceService,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewCourseComponent>) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy() {
    this.newCourseSubscription.unsubscribe();
  }

  initializeForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  doesAlreadyExist() {
    var exist = false;
    if (this.data.courses.length !== 0)
      this.data.courses.forEach(course => {
        if (course.attributes.title === this.form.value.title)
          exist = true;
      });
    if (exist)
      return true;
    else
      return false;
  }

  submitForm() {
    if (this.form.valid) {
      if (this.doesAlreadyExist()) {
        this.existError = true;
        return;
      } else {
        this.existError = false;
      }
      var newCourse = {
        data: {
          type: "courses",
          attributes: {
              title: this.form.value.title,
              description: this.form.value.description
          }
        }
      };
      this.newCourseSubscription = this.newCourseDialogService.addNewCourse(newCourse).subscribe(result => {
        this.dialogRef.close(result);
      }), (error) => {
        console.log("This is error:" + error)
      };
    }
  }

}

