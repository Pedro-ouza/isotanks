import { IIsotank } from '../../services/models';

function normalizeProduct(value?: string): string {
  return (value || '').trim().toLowerCase();
}

export function isIsotankCompatibleWithProduct(isotank: IIsotank, productName?: string): boolean {
  const expected = normalizeProduct(productName);

  if (!expected) {
    return false;
  }

  const approvedProducts = [
    isotank.Produto1Canonico,
    isotank.Produto2Canonico,
    isotank.Produto3Canonico,
  ].map(normalizeProduct).filter(Boolean);

  return approvedProducts.some((product) => product === expected);
}
