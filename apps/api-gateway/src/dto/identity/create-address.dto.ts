import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsISO31661Alpha2,
  IsOptional,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateAddressInput } from 'libs/contracts/interfaces/users/create-address-input.interface';

@Exclude()
export class CreateAddressDto implements CreateAddressInput {
  @Expose()
  @ApiProperty({
    description: 'Address first line',
    example: 'Av. Paulista, 1000',
  })
  @IsString()
  @MaxLength(200)
  line1: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Address second line', example: 'Apto 101' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  line2?: string;

  @Expose()
  @ApiProperty({ description: 'City', example: 'Sao Paulo' })
  @IsString()
  @MaxLength(100)
  city: string;

  @Expose()
  @ApiProperty({ description: 'State or province', example: 'SP' })
  @IsString()
  @MaxLength(100)
  state: string;

  @Expose()
  @ApiProperty({
    description: 'Country in ISO 3166-1 alpha-2',
    example: 'BR',
  })
  @IsISO31661Alpha2()
  country: string;

  @Expose()
  @ApiProperty({ description: 'Postal code', example: '01310-100' })
  @IsPostalCode('any')
  postalCode: string;
}
