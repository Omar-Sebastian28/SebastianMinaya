import { ProductValidator } from './product.validator';
import { Product } from '../models/product.model';

describe('ProductValidator', () => {
  it('should return no errors for a valid product', () => {
    const validProduct: Product = {
      id: 'prod-123',
      name: 'Valid Product Name',
      description: 'A long description for a valid product',
      logo: 'http://example.com/logo.png',
      dateRelease: new Date(new Date().getTime() + 86400000).toISOString(),
      dateRevision: new Date(new Date().getTime() + 86400000 * 366).toISOString()
    };
    const errors = ProductValidator.validate(validProduct);
    expect(errors.length).toBe(0);
  });

  it('should return errors for missing and invalid fields', () => {
    const invalidProduct: any = {
      id: '12', 
      name: 'T',
      description: 'Short',
      logo: '',
      dateRelease: '',
      dateRevision: ''
    };
    const errors = ProductValidator.validate(invalidProduct);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('El ID debe tener entre 3 y 10 caracteres');
    expect(errors).toContain('El nombre debe tener entre 5 y 100 caracteres');
  });
});
