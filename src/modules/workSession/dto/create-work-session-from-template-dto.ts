import { User } from '../../../modules/user/entity/user.entity';
import { TemplateTab } from '../../../modules/template/entity/templateTab.entity';

export class CreateWorkSessionFromTemplateDto {
  user: User;
  templateTabs: TemplateTab[];
};
