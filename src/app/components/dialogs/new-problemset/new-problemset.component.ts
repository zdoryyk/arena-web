import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



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
  ],
  providers:[ MatDatepickerModule, provideNativeDateAdapter()],
  templateUrl: './new-problemset.component.html',
  styleUrl: './new-problemset.component.css'
})
export class NewProblemsetComponent {
  form: FormGroup;
  range: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewProblemsetComponent>
  ) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
      startTime: [null, Validators.required], // Добавьте это
      endTime: [null, Validators.required], // И это
    }, { validators: dateRangeValidator });

    this.form = this.fb.group({
      indentifier: ['',Validators.required],
      title: ['', Validators.required],
      maxScore: [0, [Validators.required, Validators.min(1)]], 
      description: [''],
      range: this.range,
      maxNumberOfEvaluation: [null],
      minutesBetweenEvalRounds: [null],
      revisionNumberOfTheTests: [null],
    });
  }

  ngOnInit(): void {

  }

  saveProblemset() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.log("Form is invalid");
    }
  }

  closeDialog() {
    this.dialogRef.close('Closed using function');
  }
}
