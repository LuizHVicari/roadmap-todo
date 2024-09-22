import { Type } from "class-transformer"
import { IsIn, IsInt, IsOptional, IsPositive, Max, Min } from "class-validator"

export class PaginationDto {
    @IsInt()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page: number = 1

    @IsInt()
    @IsOptional()
    @Max(50)
    @IsPositive()
    @Type(() => Number)
    limit: number = 10
}