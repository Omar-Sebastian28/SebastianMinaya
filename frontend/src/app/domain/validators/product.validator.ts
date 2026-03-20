import { Product } from '../models/product.model';

export class ProductValidator {

  static validate(product: Product): string[] {
    const errors: string[] = [];

    // ID
    if (!product.id || product.id.length < 3 || product.id.length > 10) {
      errors.push('El ID debe tener entre 3 y 10 caracteres');
    }

    // Nombre
    if (!product.name || product.name.length < 5 || product.name.length > 100) {
      errors.push('El nombre debe tener entre 5 y 100 caracteres');
    }

    // Descripción
    if (!product.description || product.description.length < 10 || product.description.length > 200) {
      errors.push('La descripción debe tener entre 10 y 200 caracteres');
    }

    // Logo
    if (!product.logo) {
      errors.push('El logo es requerido');
    }

    // USANDO normalizeDate CORRECTAMENTE
    const today = this.normalizeDate(new Date());
    const release = this.normalizeDate(new Date(product.dateRelease));

    if (release < today) {
      errors.push('La fecha de liberación no puede ser menor a hoy');
    }

    // Validación revisión = +1 año
    const revision = this.normalizeDate(new Date(product.dateRevision));

    const expectedRevision = new Date(release);
    expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);

    if (revision.getTime() !== expectedRevision.getTime()) {
      errors.push('La fecha de revisión debe ser exactamente un año posterior');
    }

    return errors;
  }

  // MÉTODO PRIVADO (clean code)
  private static normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
