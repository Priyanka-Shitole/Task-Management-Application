import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { CurrencyPipe } from 'src/app/Pipes/currency.pipe';
import { takeUntil } from 'rxjs/operators';
import { PERCENT_MASK } from 'src/app/constant';
import { PercentagePipe } from 'src/app/Pipes/percentage.pipe';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  providers: [CurrencyPipe, PercentagePipe],
})
export class AddTaskComponent implements OnInit {

  message: string = "Are you sure?";
  unSubscribe$: Subject<boolean> = new Subject();
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  selectedQuantity: any;
  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  priceAmount: any;
  quantity: any;
  percentage: any;
  totalAmount: any;
  options = [ // id field is not necessary
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
  ];
  delivertStatus = [
    { id: 'completed', value: 'Completed' },
    { id: 'incomplete', value: 'Incomplete' }
  ]

  constructor(private currencyPipe: CurrencyPipe, private percentagePipe: PercentagePipe, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    this.createForm();

  }
  inputValidator(event: any) {
    const pattern = /^[a-zA-Z0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    }
  }
  ngOnInit() {

    // this.setChangeValidate()
    this.formGroup.controls['total'].disable();
    this.formGroup.controls['discountedPrice'].disable();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'title': [null, [Validators.required]],
      'price': [null, Validators.required],
      'quantity': [null, [Validators.required]],
      'total': [null, [Validators.required]],
      'discountPercentage': [null, [Validators.required]],
      'discountedPrice': [null, [Validators.required]],
      'status': [null, [Validators.required]],
    });

    this.formGroup.controls['price'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((price) => {
      let amount = this.currencyPipe.transform(price);
      this.formGroup.controls['price'].setValue(amount, { emitEvent: false });
    });
    // this.formGroup.controls['total'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((price) => {
    //   let amount = this.currencyPipe.transform(price);
    //   this.formGroup.controls['total'].setValue(amount, { emitEvent: false });
    // });
    // this.formGroup.controls['discountedPrice'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((price) => {
    //   let amount = this.currencyPipe.transform(price);
    //   this.formGroup.controls['discountedPrice'].setValue(amount, { emitEvent: false });
    // });

    this.formGroup.controls['discountPercentage'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((price) => {
      let amount = this.percentagePipe.transform(price);
      this.formGroup.controls['discountPercentage'].setValue(amount, { emitEvent: false });
    });
  }

  onSubmit(post) {
    this.post = this.formGroup.getRawValue();
    this.dialogRef.close({ data: this.post });
  }
  onConfirmClick(): void {
    this.dialogRef.close();
  }
  getTotalPrice(event) {
    let timeout = null;
    clearTimeout(timeout);
    let self = this;
    timeout = setTimeout(function () {
      this.priceAmount = (<HTMLInputElement>document.getElementById("priceField")).value;
      typeof (event.value) == 'number' ? this.quantity = event.value : '';

      if (this.quantity !== undefined && this.priceAmount !== '') {

        this.priceAmount = new Intl.NumberFormat().format(Number(this.priceAmount?.replace(/[^0-9]/g, '')));

        self.getTotalAmount(String(this.priceAmount * this.quantity));
      }
    }, 1000);

  }
  getPercentage(event) {
    let timeout = null;
    clearTimeout(timeout);
    let self = this;
    timeout = setTimeout(function () {
      this.percentage = (<HTMLInputElement>document.getElementById("percentageField")).value;
      this.percentage = this.percentage.replace('%', '');
      self.getTotalDiscountedAmount(self.floatToStr(((this.priceAmount * this.quantity) * (100 - this.percentage)) / 100));
    }, 1000);
  }
  getTotalAmount(amount) {
    this.percentage = (<HTMLInputElement>document.getElementById("percentageField")).value;
    this.percentage = this.percentage.replace('%', '');
    if (this.percentage > 0) {
      this.getPercentage('');
    }
    this.formGroup.patchValue({
      total: '$' + amount,
    });
  }
  getTotalDiscountedAmount(amount) {
    this.formGroup.patchValue({
      discountedPrice: '$' + amount,
    });
  }
  floatToStr(num) {
    return num.toString().indexOf('.') === -1 ? num.toFixed(1) : num.toString();
  }
}
