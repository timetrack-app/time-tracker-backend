import { injectable } from 'inversify';
import { IWorkSessionService } from '../../src/modules/workSession/interfaces/IWorkSession.service';
import { CreateWorkSessionServiceDto } from '../../src/modules/workSession/dto/create-work-session-service-dto';
import { EndWorkSessionDto } from '../../src/modules/workSession/dto/end-work-session-dto';
import { FindLatestUnfinishedWorkSessionDto } from '../../src/modules/workSession/dto/find-latest-unfinished-work-session-dto';
import { CreateWorkSessionServiceReturnDto } from '../../src/modules/workSession/dto/create-work-session-service-return-dto';
import { WorkSession } from '../../src/modules/workSession/entity/workSession.entity';
import { fakeWorkSession } from '../factory/workSession.factory';
import { getWorkSessionsByUserIdDto } from 'src/modules/workSession/dto/getWorkSessionByUserId.dto';
import { UpdateActiveTaskServiceDto } from 'src/modules/workSession/dto/update-active-task-service.dto';

@injectable()
export class FakeWorkSessionService implements IWorkSessionService {
  updateActiveTask(
    updateActiveTaskServiceDto: UpdateActiveTaskServiceDto,
  ): Promise<WorkSession> {
    throw new Error('Method not implemented.');
  }
  createWorkSession(
    createWorkSessionServiceDto: CreateWorkSessionServiceDto,
  ): Promise<CreateWorkSessionServiceReturnDto> {
    // Simulate creating a work session based on the provided data
    return Promise.resolve({
      isUnfinished: true,
      workSession: fakeWorkSession(), // Using the factory to generate a WorkSession
    });
  }

  getWorkSessionsByUserId(
    getWorkSessionNyUserIdDto: getWorkSessionsByUserIdDto,
  ): Promise<WorkSession[]> {
    return Promise.resolve([fakeWorkSession()]);
  }

  getLatestUnfinishedWorkSession(
    findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto,
  ): Promise<WorkSession> {
    // Simulate finding the latest unfinished work session
    return Promise.resolve(fakeWorkSession()); // Using the factory to generate a WorkSession
  }

  endWorkSession(endWorkSessionDto: EndWorkSessionDto): Promise<WorkSession> {
    // Simulate ending a work session
    return Promise.resolve(fakeWorkSession()); // Using the factory to generate a WorkSession
  }
}
