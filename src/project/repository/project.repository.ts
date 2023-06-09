import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Brackets, Raw, Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { User } from 'src/auth/entity/user.entity';
import { ProjectListRequest } from '../dto/request/project/projects.request';
import { ScrollRequest } from 'src/common/utils/scroll-request';
import { CreateProjectRequest } from '../dto/request/project/create-project.request';

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProejct(
    request: CreateProjectRequest,
    user: User,
  ): Promise<Project> {
    const { title, content } = request;
    const project = await this.create({
      title,
      content,
      userId: user.id,
    });

    await this.save(project);
    return project;
  }

  async getAllProjects(projectRequest: ProjectListRequest): Promise<Project[]> {
    const { lastItemId, itemCount, keyword } = projectRequest;

    const where: any[] = [];

    if (keyword) {
      where.push(
        { title: Raw((alias) => `${alias} LIKE '%${keyword}%'`) },
        { content: Raw((alias) => `${alias} LIKE '%${keyword}%'`) },
      );
    }

    const queryBuilder = this.createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user') // User 엔티티 조인
      .leftJoinAndSelect('project.tags', 'tags') // Tag 엔티티 조인
      .leftJoinAndSelect('project.projectPositions', 'projectPositions') // Tag 엔티티 조인
      .leftJoinAndSelect('project.projectStacks', 'projectStacks') // ProjectStack 엔티티 조인
      .leftJoinAndSelect('projectStacks.stack', 'stack')
      .where('project.id > :lastItemId', { lastItemId })
      .orderBy('project.id')
      .take(itemCount);

    if (where.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          where.forEach((condition) => {
            qb.orWhere(condition);
          });
        }),
      );
    }

    const projects = await queryBuilder.getMany();

    return projects;
  }

  async countProjects(projectRequest: ProjectListRequest): Promise<number> {
    const { lastItemId, keyword } = projectRequest;

    const where: any[] = [];

    if (keyword) {
      where.push(
        { title: Raw((alias) => `${alias} LIKE '%${keyword}%'`) },
        { content: Raw((alias) => `${alias} LIKE '%${keyword}%'`) },
      );
    }

    const queryBuilder = this.createQueryBuilder('project')
      .leftJoin('project.user', 'user') // User 엔티티 조인
      .leftJoin('project.tags', 'tags') // Tag 엔티티 조인
      .leftJoin('project.projectPositions', 'projectPositions') // Tag 엔티티 조인
      .leftJoin('project.projectStacks', 'projectStacks') // ProjectStack 엔티티 조인
      .where('project.id > :lastItemId', { lastItemId });

    if (where.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          where.forEach((condition) => {
            qb.orWhere(condition);
          });
        }),
      );
    }

    const totalCount = await queryBuilder.getCount();

    return totalCount;
  }

  async getMyProjects(request: ScrollRequest, user: User): Promise<Project[]> {
    const { lastItemId, itemCount } = request;

    return this.find({
      where: {
        userId: user.id,
        id: Raw((alias) => `${alias} > ${lastItemId}`),
      },
      order: {
        id: 'ASC',
      },
      take: itemCount,
    });
  }
}
