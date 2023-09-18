import { User } from 'src/modules/user/entity/user.entity';
import { TemplateTab } from 'src/modules/template/entity/templateTab.entity';
import { TemplateList } from 'src/modules/template/entity/templateList.entity';

export class CreateWorkSessionFromTemplateDto {
  user: User;
  templateTabs: TemplateTab[];
};
