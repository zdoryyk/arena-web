import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewCourseServiceService } from '../new-course/new-course-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { GroupDetailService } from './group-detail.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginator,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css'
})
export class GroupDetailComponent {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'problemsets'];
  private groupSubscription = new Subscription;
  private usersSubscription = new Subscription;
  groupStudents: any = [];
  loading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private groupDetailService: GroupDetailService,
  public dialog: MatDialog) { }

  ngOnInit(): void {
    var groupUsers = [];
    this.groupSubscription = this.groupDetailService.getGroup(this.data.id).subscribe(result => {
      groupUsers = result.data.relationships.students.data;
      var i = 0;
      this.usersSubscription = this.groupDetailService.getUsers().subscribe(result2 => {
        result2.data.forEach(user => {
          groupUsers.forEach(groupUser => {
            if (user.id === groupUser.id)
              this.groupStudents.push(user);
          });
        });
        this.dataSource.data = this.groupStudents;
        if (this.dataSource.data.length !== 0)
          this.loading = false;
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  openMemberProblemsetsDialog(studentId, studentName) {
    // const dialogRef = this.dialog.open(GroupMemberProblemsetsDialogComponent, {
    //   data: {
    //     studentId: studentId,
    //     studentName: studentName,
    //     problemsets: this.data.problemsets
    //   }
    // });
  }

}
