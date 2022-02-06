import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
  @ApiProperty()
  token: string;
}
