import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss'],
})
export class CreateProductsComponent implements OnInit {
  prodId = 1;
  categories = [];
  cat_id = 0;

  errorMessage = '';
  loading = false;

  title = '';
  short_desc = '';
  description = '';
  price = '';
  quantity = '';
  image = '';
  constructor(
    private route: ActivatedRoute,
    private _product: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.prodId = +this.route.snapshot.paramMap.get('id');
    if (this.prodId) {
      this._product.getSingleProduct(this.prodId).subscribe((product) => {
        console.log(product);
        this.title = product.title;
        this.description = product.description;
        this.short_desc = product.short_desc;
        this.image = product.image;
        this.price = product.price;
        this.quantity = product.quantity;
        this.cat_id = product.cat_id;
      });
    }

    this._product.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (
      this.title &&
      this.short_desc &&
      this.description &&
      this.price &&
      this.quantity &&
      this.image &&
      this.cat_id
    ) {
      this.loading = true;
      if (this.prodId) {
        this._product
          .update({
            id: this.prodId,
            title: this.title,
            description: this.description,
            short_desc: this.short_desc,
            price: this.price,
            quantity: this.quantity,
            image: this.image,
            cat_id: this.cat_id,
          })
          .subscribe(
            (res) => {
              console.log(res);
              this.loading = false;
              this._router.navigate(['/admin/dashboard']);
            },
            (err) => {
              console.log(err);
              this.errorMessage = err.error.message;
              this.loading = false;
            }
          );
      } else {
        this._product
          .register({
            title: this.title,
            description: this.description,
            short_desc: this.short_desc,
            price: this.price,
            quantity: this.quantity,
            image: this.image,
            cat_id: this.cat_id,
          })
          .subscribe(
            (res) => {
              console.log(res);
              this.loading = false;
              this._router.navigate(['/admin/dashboard']);
            },
            (err) => {
              console.log(err);
              this.errorMessage = err.error.message;
              this.loading = false;
            }
          );
      }
    } else {
      this.errorMessage = 'Make sure to fill everything ;)';
    }
  }

  canSubmit(): boolean {
    return this.title &&
      this.short_desc &&
      this.description &&
      this.price &&
      this.quantity &&
      this.image &&
      this.cat_id
      ? true
      : false;
  }
}
