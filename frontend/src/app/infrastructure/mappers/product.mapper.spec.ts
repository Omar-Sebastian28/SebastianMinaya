import { ProductMapper } from './product.mapper';
import { Product } from '../../domain/models/product.model';
import { ProductDto } from '../dto/product.dto';
import { describe, it, expect } from 'vitest';

describe('ProductMapper', () => {
  const mockDto: ProductDto = {
    id: '1',
    name: 'Test',
    description: 'Description',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  it('should map from DTO to domain correctly', () => {
    const domain = ProductMapper.toDomain(mockDto);
    
    expect(domain.id).toBe(mockDto.id);
    expect(domain.name).toBe(mockDto.name);
    expect(new Date(domain.dateRelease).toISOString()).toBe(new Date(mockDto.date_release).toISOString());
  });

  it('should map from domain to DTO correctly', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test',
      description: 'Description',
      logo: 'logo.png',
      dateRelease: '2025-01-01',
      dateRevision: '2026-01-01'
    };
    
    const dto = ProductMapper.toDto(mockProduct);
    expect(dto.id).toBe(mockProduct.id);
    expect(dto.date_release).toBe(mockProduct.dateRelease);
  });
});
