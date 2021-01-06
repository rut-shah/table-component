import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.scss']
})
export class StatusUpdateComponent {

  message: string;
  className: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data.message;
    this.className = data.className;
  }
}
