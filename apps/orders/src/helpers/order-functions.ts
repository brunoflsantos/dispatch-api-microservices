import { NotFoundException } from '@nestjs/common';
import { template } from 'libs/common/utils/functions.utils';
import { ProductResult } from 'libs/contracts/interfaces/products/product-result.interface';
import { I18N_ORDERS } from '../constants/i18n.constant';
import { CreateOrderProductDto } from '../dto/create-order-product.dto';

export const languageToCurrency = (language: string): string => {
  if (language.startsWith('en')) return 'USD';
  if (language.startsWith('pt')) return 'BRL';
  if (language.startsWith('es')) return 'EUR';
  return 'USD'; // Default to USD if language is not recognized
};

export const languageToLocale = (language: string): string => {
  if (language.startsWith('en')) return 'en-US';
  if (language.startsWith('pt')) return 'pt-BR';
  if (language.startsWith('es')) return 'es-ES';
  return 'en-US'; // Default to en-US if language is not recognized
};

export const toCurrencyFormatted = (
  value: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL',
): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value / 100,
  );
};

export const calculateTotal = (
  products: CreateOrderProductDto[],
  catalogProducts: ProductResult[],
): number => {
  return products.reduce((sum, prod) => {
    const cProd = catalogProducts.find((p) => p.id === prod.productId);
    if (!cProd) {
      throw new NotFoundException(template(I18N_ORDERS.ERRORS.INVALID_ORDER_DATA));
    }
    return sum + cProd.price * prod.quantity;
  }, 0);
};
