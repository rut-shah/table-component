import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryData } from 'src/app/models/inventory-data-model';
import { DataService } from 'src/app/services/data.service';
import { UpdateSuccessComponent } from '../update-success/update-success.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  displayedColumns: string[] = ['name', 'sku', 'price', 'stock', 'noOfSales', 'active'];
  dataSource = new MatTableDataSource<InventoryData>();

  @ViewChild(MatPaginator, {static: false}) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor( private dataService: DataService, private _snackBar: MatSnackBar ) { 
    this.dataService.getInventoryData().subscribe((response) => {
      this.dataSource.data = response.inventory;
    });
  }

  reorder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatus(event: MatSelectChange, i: number) {
    const newData = this.dataSource.data[i];
    newData.active = event.value;

    this.dataService.updateStatus({
      index: i+1,
      data: newData
    }).subscribe((response) => {
      console.log(response);
      this._snackBar.openFromComponent(UpdateSuccessComponent, {
        duration: 50000
      });
    })
  }
}
