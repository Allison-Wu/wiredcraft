import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationReqDTO {
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'eyJwYWdlIjoyfQ==',
    description: 'The scroll id of pagination'
  })
  scrollId?: string;
}

class PaginationDTO {
  constructor(scrollId: string, total: number) {
    this.scrollId = scrollId;
    this.total = total;
  }

  @ApiProperty({
    example: 'eyJwYWdlIjoyfQ==',
    description: 'The scroll id of pagination'
  })
  scrollId?: string;

  @ApiProperty({
    example: '0',
    description: 'The total count of the data'
  })
  total: number;
}

export class PaginationRespDTO<T> {
  constructor(data: T[], scrollId: string, total: number) {
    this.data = data;
    this.pagination = new PaginationDTO(scrollId, total);
  }

  @ApiProperty()
  data: T[];

  @ApiProperty()
  pagination: PaginationDTO;
}

export interface IPagination {
  page: number;
  pageSize: number;
}

export class ErrorRespDTO {
  @ApiProperty({
    example: 'Authorization is required',
    description: 'Error message',
  })
  message: string;

  @ApiProperty({
    example: 401,
    description: 'Error status code',
  })
  code: number;

  @ApiProperty({
    example: {},
    description: 'Extra info for debug',
  })
  extra: { stack: string };
}