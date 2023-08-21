import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { from, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/Services/product.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';

export interface ProductData {
  id: string;
  title: string,
  price: number,
  userId: string;
  quantity: number,
  total: number,
  discountPercentage: number,
  discountedPrice: number,
  status: string
}
@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'price', 'quantity', 'total', 'discountPercentage', 'discountedPrice', 'status', 'customColumn1'];
  product: ProductData[] = [];
  productList = [];
  taskId: any;
  status = 'All';
  productData = new MatTableDataSource([] as ProductData[]);
  @Input() data;
  addedProductData: any;
  @ViewChild(MatSort) sort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showloader = false;

  addProductDialog: MatDialogRef<AddTaskComponent>;
  successDialog: MatDialogRef<SuccessDialogComponent>;


  ngAfterViewInit() {
    this.productData.sort = this.sort;
  }
  ngOnInit() {
    this.getAllProductData();
  }

  getAllProductData() {

    this.productService.getAllTasks().subscribe((response: any) => {
      this.productList = response.products;
      this.product = response.products;
      this.productData = new MatTableDataSource(this.product);
      this.productData.sort = this.sort;
      this.productData.paginator = this.paginator;
    })
  }
  updateTableDataSource() {
    this.productData = new MatTableDataSource(this.product);
    this.productData.sort = this.sort;
    this.productData.paginator = this.paginator;
  }
  updateTask(id: any) {
    this.taskId = id;
    this.openDialog('update');


    this.successDialog.afterClosed().subscribe(res => {
      if (res.data === 'yes') {
        this.productService.updateTasks(id).subscribe((res: any) => {
          this.showloader = true;
          var index = this.productList.findIndex(function (item: any, i: any) {
            return item.id === id
          });
          this.product[index].status = 'completed';
          this.updateTableDataSource();
          this.showloader = false;
          this.toastr.success('Product status updated as completed successfully', 'Success', {
            timeOut: 3000,
          });
        })
      }

    });



  }
  deleteTask(id: any) {
    this.taskId = id;

    this.openDialog('delete');

    this.successDialog.afterClosed().subscribe(res => {
      if (res.data === 'yes') {


        this.productService.deleteTask(id).subscribe(res => {
          this.showloader = true;
          var setValue = this.product;
          this.product = setValue.filter((el: any) => {
            return el.id !== id;
          });
          this.updateTableDataSource();
          this.showloader = false;
          this.toastr.success('Product deleted successfully', 'Success', {
            timeOut: 3000,
          });
        })
      }

    });



  }
  constructor(public toastr: ToastrService, private _liveAnnouncer: LiveAnnouncer, private productService: ProductService, private dialog: MatDialog,
  ) {
  }
  filterData(status: any) {
    this.status = status;
    this.product = [];
    this.productList.forEach((element: any) => {
      element.status == status ? this.product.push(element) : status == 'All' ? this.product = this.productList : '';
    });

    this.productData = new MatTableDataSource(this.product);
    this.productData.sort = this.sort;
    this.productData.paginator = this.paginator;
  }

  openAddProductDialog() {
    this.addProductDialog = this.dialog.open(AddTaskComponent, { disableClose: true });
    this.addProductDialog.afterClosed().subscribe(res => {
      if (res) {
        this.addedProductData = res.data;
        this.addedProductData.id = this.product.length + 1;
        this.addedProductData.userId = this.product.length + 1;
        this.product.splice(0, 0, this.addedProductData);
        this.updateTableDataSource();
        this.showSuccess();
      }

    });
  }
  showSuccess() {
    this.toastr.success('Product details added successfully', 'Success', {
      timeOut: 3000,
    });
  }
  openDialog(action: string) {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      disableClose: true,
      data: {
        action: action
      },
    });
    // this.successDialog.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.addedProductData = res.data;
    //     this.addedProductData.id = this.product.length + 1;
    //     this.addedProductData.userId = this.product.length + 1;
    //     this.product.splice(0, 0, this.addedProductData);
    //     this.updateTableDataSource();
    //   }

    // });
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}
