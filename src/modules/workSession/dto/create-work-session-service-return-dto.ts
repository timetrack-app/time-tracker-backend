import { IsBoolean, IsOptional } from 'class-validator';
import { WorkSession } from '../entity/workSession.entity';

export class CreateWorkSessionServiceReturnDto {
  @IsOptional()
  @IsBoolean()
  isUnfinished: boolean;

  workSession: WorkSession;
}
