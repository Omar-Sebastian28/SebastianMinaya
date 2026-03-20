import { Product } from '../../domain/models/product.model';
import { ProductDto } from '../dto/product.dto';

export class ProductMapper {

  static toDomain(dto: ProductDto): Product {
    if (!dto) {
      throw new Error('[ProductMapper]: dto is required');
    }

    return {
      id: dto.id || '',
      name: dto.name || '',
      description: dto.description || '',
      logo: dto.logo || '',
      dateRelease: dto.date_release ? new Date(dto.date_release).toISOString() : '',
      dateRevision: dto.date_revision ? new Date(dto.date_revision).toISOString() : '',
    };
  }

  static toDto(product: Product): ProductDto {
    if (!product) {
      throw new Error('[ProductMapper]: product is required');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.dateRelease,
      date_revision: product.dateRevision,
    };
  }
}
