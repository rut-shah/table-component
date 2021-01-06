import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryData } from 'src/app/models/inventory-data-model';
import { DataService } from 'src/app/services/data.service';
import { StatusUpdateComponent } from '../status-update/status-update.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'sku', 'price', 'stock', 'noOfSales', 'active', 'delete'];
  dataSource = new MatTableDataSource<InventoryData>();

  addInventoryForm!: FormGroup;
  editInventoryForm!: FormGroup;
  inventoryData!: InventoryData[];

  showInventoryForm = false;
  showEditInventoryForm = false;
  editIndex = '';

  @ViewChild(MatPaginator, {static: false}) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor( private dataService: DataService, private snackBar: MatSnackBar ) {
    this.dataService.getInventoryData().subscribe((response) => {
      this.inventoryData = response.inventory;
      this.dataSource.data = this.inventoryData;
    });
  }

  ngOnInit(): void {
    this.addInventoryForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')]),
      stock: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      active: new FormControl('', [Validators.required])
    });

    this.editInventoryForm = new FormGroup({
      id: new FormControl({value: '', disabled: true}, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')]),
      stock: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      noOfSales: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      active: new FormControl('', [Validators.required])
    });
  }

  reorder(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  filterData(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleFields(): void {
    this.showInventoryForm = !this.showInventoryForm;
  }

  addInventory(): void {
    const productData = {
      id: this.addInventoryForm.get('id')?.value,
      name: this.addInventoryForm.get('name')?.value,
      sku: this.addInventoryForm.get('sku')?.value,
      price: this.addInventoryForm.get('price')?.value,
      stock: this.addInventoryForm.get('stock')?.value,
      noOfSales: '0',
      active: this.addInventoryForm.get('active')?.value
    };

    this.dataService.modifyInventory({
      data: productData,
      status: 'added'
    }).subscribe((response: any) => {
      this.dataSource.data = response.inventory;
      this.addInventoryForm.reset();
      this.showSnackBar('success', response.message);
    },
    (error: Error) => {
      console.log(error.message);
      this.showSnackBar('error', error.message);
    });
  }

  updateInventory(): void {
    this.dataService.modifyInventory({
      data: this.editInventoryForm.getRawValue(),
      status: 'updated'
    }).subscribe((response: any) => {
      this.showEditInventoryForm = false;
      this.editIndex = '';
      this.dataSource.data = response.inventory;
      this.editInventoryForm.reset();
      this.showSnackBar('success', response.message);
    },
    (error: Error) => {
      console.log(error.message);
      this.showSnackBar('error', error.message);
    });
  }

  editInventory(rowData: any, index: string): void {
    this.showEditInventoryForm = true;
    this.editIndex = index;
    this.editInventoryForm.patchValue(rowData);
  }

  updateStatus(event: MatSelectChange, pId: string): void {
    this.dataService.updateStatus({
      productId: pId,
      active: event.value
    }).subscribe((response: any) => {
      this.showSnackBar('success', response.message);
    },
    (error: Error) => {
      console.log(error.message);
      this.showSnackBar('error', error.message);
    });
  }

  deleteData(pId: string): void {
    this.dataService.deleteInventory({
      productId: pId,
    }).subscribe((response: any) => {
      this.dataSource.data = response.inventory;
      this.showSnackBar('error', response.message);
    },
    (error: Error) => {
      console.log(error.message);
      this.showSnackBar('error', error.message);
    });
  }

  showSnackBar(pClass: string, msg: string): void {
    this.snackBar.openFromComponent(StatusUpdateComponent, {
      duration: 5000,
      panelClass: pClass,
      data: {
        message: msg
      }
    });
  }
}
