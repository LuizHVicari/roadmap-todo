import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/commom/dto/pagination.dto";

export class TodoFilteringPaginationDto extends PaginationDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({obj, key}) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
      })
    completed?: boolean
}