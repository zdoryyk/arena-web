import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';


function dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
  const start = group.get('start')?.value;
  const end = group.get('end')?.value;
  return start && end && start < end ? null : { dateRangeInvalid: true };
}

@Component({
  selector: 'app-new-problemset',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CalendarModule
    
  ],
  providers:[ MatDatepickerModule, provideNativeDateAdapter()],
  templateUrl: './new-problemset.component.html',
  styleUrl: './new-problemset.component.scss'
})
export class NewProblemsetComponent {
  form: FormGroup;
  date: FormControl;
  // startTime: FormControl;
  // endTime: FormControl;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewProblemsetComponent>
  ) {

    this.form = this.fb.group({
      indentifier: ['',Validators.required],
      title: ['', Validators.required],
      maxScore: [0, [Validators.required, Validators.min(1)]], 
      description: [''],
      maxNumberOfEvaluation: [null],
      minutesBetweenEvalRounds: [null],
      revisionNumberOfTheTests: [null],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  ngOnInit(): void {

  }

  saveProblemset() {
    if (this.form.valid) {
      console.log("Form values:", this.form.value);
  
      const startTimeValue = this.form.get('startTime')?.value;
      const endTimeValue = this.form.get('endTime')?.value;
  
      console.log("Start Time:", startTimeValue);
      console.log("End Time:", endTimeValue);
  
      // Проверка на null или пустое значение
      if (startTimeValue && endTimeValue) {
        console.log("Both start and end time are provided.");
      } else {
        console.log("Start or end time is missing.");
      }
    } else {
      console.log("Form is invalid");
      // Здесь можно добавить логику для отображения сообщений об ошибке пользователю
    }
  }
  

  closeDialog() {
    this.dialogRef.close('Closed using function');
  }
}
