import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ type: [String], description: 'Array of permission IDs to assign to the role' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionIds: string[];
}
