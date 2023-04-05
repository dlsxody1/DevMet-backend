import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectService } from '../services/project.service';
import { Project } from '../entity/project.entity';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { User } from 'src/user/entity/user.entity';
import { GetUser } from 'src/common/decorator/get-user.dacorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('projects')
export class ProjectController {
  constructor(private proejctService: ProjectService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  getAllProjects(): Promise<Project[]> {
    return this.proejctService.getAllProjects();
  }
  @Get('/:id')
  getProjectById(@Param('id', ParseIntPipe) id: number) {
    return this.proejctService.getProjectById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.proejctService.createProject(createProjectDto, user);
  }

  @Delete('/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.proejctService.deleteProject(id);
  }

  @Patch('/:id')
  updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.proejctService.updateProject(id, updateProjectDto);
  }

  // @Patch('/:id/complete')
  // updateBoardComplete(
  //   @Param('id') id: number,
  //   @Body('completed') completed: boolean,
  // ) {
  //   this.boardsService.updateBoardComplete(id, completed);
  // }
  // @Post('/:id/like')
  // updateLikeCount(@Param('id') id: number, @GetUser() user: User): void {
  //   this.boardsService.updateLikeCount(id, user);
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('images'))
  // uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @GetUser() user: User,
  //   @Body() body,
  // ) {
  //   console.log(file, user, body);
  // }
}
