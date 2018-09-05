import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-remove-record',
  template: `<h1 mat-dialog-title>Are you sure you want to remove this element?</h1>
            <mat-dialog-content>
              <p>You are just about removing {{ passedData.record }} </p>
            </mat-dialog-content>
            <mat-dialog-actions>
              <button mat-button [mat-dialog-close]="true">Yes</button>
              <button mat-button [mat-dialog-close]="false">No</button>
            </mat-dialog-actions>`
})
export class RemoveElementComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}