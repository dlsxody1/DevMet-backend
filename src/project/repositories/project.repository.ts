import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProejct(
    createProjectDto: CreateProjectDto,
    // user: User,
  ): Promise<Project> {
    const { title, content, tag } = createProjectDto;
    const project = await this.create({
      title,
      content,
      tag,
    });

    await this.save(project);
    return project;
  }
}