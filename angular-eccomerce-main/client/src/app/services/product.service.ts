import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products, Product } from '../shared/models/product.model';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private _api: ApiService) {}

  getAllProducts(limitOfResults = 9, page): Observable<Products> {
    return this.http.get<Products>(this.url + 'products', {
      params: {
        limit: limitOfResults.toString(),
        page: page,
      },
    });
  }

  getSingleProduct(id: Number): Observable<any> {
    console.log(id);
    return this._api.getTypeRequest('products/' + id);
  }

  getCategories(): Observable<any> {
    return this._api.postTypeRequest('products/categories', {});
  }

  register(product: any): Observable<any> {
    return this._api.postTypeRequest('products/add', {
      title: product.title,
      short_desc: product.short_desc,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      cat_id: product.cat_id,
    });
  }

  update(product: any): Observable<any> {
    return this._api.postTypeRequest('products/update', {
      id: product.id,
      title: product.title,
      short_desc: product.short_desc,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      cat_id: product.cat_id,
    });
  }
}
