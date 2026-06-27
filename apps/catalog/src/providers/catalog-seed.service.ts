import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../constants/catalog.token';
import type { IProductRepository } from '../interfaces/product-repository.interface';

@Injectable()
export class CatalogSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CatalogSeedService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.SEED_TEST_DATA !== 'true') return;
    await this.seedProducts();
  }

  private async seedProducts(): Promise<void> {
    const count = await this.productRepository.count();
    if (count > 0) return;

    const products = [
      {
        name: 'MacBook Pro 14"',
        description: 'Apple laptop with M3 Pro chip, 18GB RAM, 512GB SSD',
        stock: 15,
        price: 199900,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones',
        stock: 40,
        price: 34900,
      },
      {
        name: 'Samsung 49" Odyssey G9',
        description: 'Curved DQHD 240Hz gaming monitor with QLED technology',
        stock: 8,
        price: 149900,
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless mouse with ultra-fast scroll and USB-C charging',
        stock: 60,
        price: 9900,
      },
      {
        name: 'Keychron Q1 Pro',
        description: 'Wireless mechanical keyboard with QMK/VIA support and aluminum frame',
        stock: 25,
        price: 18900,
      },
    ];

    const entities = products.map((p) => this.productRepository.createEntity(p));
    await this.productRepository.saveBulk(entities);
    this.logger.log(`${entities.length} products seeded`);
  }
}
