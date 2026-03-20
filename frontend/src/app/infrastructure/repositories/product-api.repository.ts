import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/models/product.model';
import { ProductDto } from '../dto/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProductApiRepository implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  async getAll(): Promise<Product[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: ProductDto[] }>(this.baseUrl)
      );

      return (response?.data || []).map(ProductMapper.toDomain);
    } catch (err) {
      console.error('[ProductApiRepository]: getAll failed', err);
      throw err;
    }
  }

  async create(product: Product): Promise<{ message: string; data: Product }> {
    const dto = ProductMapper.toDto(product);
    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string; data: ProductDto }>(this.baseUrl, dto)
      );

      return {
        message: response.message,
        data: ProductMapper.toDomain(response.data),
      };
    } catch (err) {
      console.error('[ProductApiRepository]: create failed', err);
      throw err;
    }
  }

  async verifyId(id: string): Promise<boolean> {
    try {
      return await firstValueFrom(
        this.http.get<boolean>(`${this.baseUrl}/verification/${id}`)
      );
    } catch (err) {
      console.error('[ProductApiRepository]: verifyId failed', err);
      return false;
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
      );
      return { message: response.message };
    } catch (err) {
       console.error('[ProductApiRepository]: delete failed', err);
       throw err;
    }
  }

  async update(id: string, product: Product): Promise<{ message: string; data: Product }> {
    const dto = ProductMapper.toDto(product);
    try {
      const response = await firstValueFrom(
        this.http.put<{ message: string; data: ProductDto }>(`${this.baseUrl}/${id}`, dto)
      );

      return {
        message: response.message,
        data: ProductMapper.toDomain(response.data),
      };
    } catch (err) {
       console.error('[ProductApiRepository]: update failed', err);
       throw err;
    }
  }
}
