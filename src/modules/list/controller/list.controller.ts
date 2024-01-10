import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  httpPut,
  httpDelete,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IListService } from './../interface/IList.service';
import { CreateListDto } from '../dto/createList.dto';
import { List } from '../entity/list.entity';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';

@controller(
  '/work-sessions/:workSessionId/tabs/:tabId/lists',
  AuthGuardMiddleware
)
export class ListController {
  constructor(
    @inject(TYPES.IListService)
    private readonly listService: IListService,
  ) {}

  @httpPost('/')
  public async createList(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestBody() reqBody: CreateListDto,
    _: Request,
    res: Response,
  ) {
    const newList = await this.listService.createList(
      workSessionId,
      tabId,
      reqBody,
    );
    return res.status(200).json(newList);
  }

  @httpPut('/:listId')
  public async updateList(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestParam('listId') listId: number,
    @requestBody() reqBody: Partial<List>,
    _: Request,
    res: Response,
  ) {
    const updatedList = await this.listService.updateList(
      workSessionId,
      tabId,
      listId,
      reqBody,
    );
    return res.status(200).json(updatedList);
  }

  @httpDelete('/:listId')
  public async deleteList(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestParam('listId') listId: number,
    _: Request,
    res: Response,
  ) {
    await this.listService.deleteList(workSessionId, tabId, listId);
    return res.status(204).send();
  }
}
