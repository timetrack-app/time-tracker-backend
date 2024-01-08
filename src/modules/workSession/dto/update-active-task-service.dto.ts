import { IsNumber } from 'class-validator';

export class UpdateActiveTaskServiceDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  workSessionId: number;
  @IsNumber()
  activeTabId: number;
  @IsNumber()
  activeListId: number;
  @IsNumber()
  activeTaskId: number;
}
