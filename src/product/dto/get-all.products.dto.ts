import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/pagination/pagination.dto";

export enum EnumbProductSort {
    HIGH_PRICE = 'high-price',
    LOW_PRICE = 'low-price',
    NEWEST = 'newest',
    OLDEST = 'oldest'
}

export class GetAllProductDto extends PaginationDto {
    @IsOptional()
    @IsEnum(EnumbProductSort)
    sort?: EnumbProductSort

    @IsOptional()
    @IsString()
    searchTerm?: string
}