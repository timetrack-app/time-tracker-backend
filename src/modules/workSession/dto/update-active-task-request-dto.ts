import { IsNumber } from 'class-validator';

export class UpdateActiveTaskRequestDto {
  @IsNumber()
  activeTabId: number;
  @IsNumber()
  activeListId: number;
  @IsNumber()
  activeTaskId: number;
}
