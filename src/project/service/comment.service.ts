import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { CreateCommentDto } from '../dto/comment/create-comment.dto';
import { UpdateCommentDto } from '../dto/comment/update-comment.dto';
import { CommentRepository } from '../repository/comment.repository';
import { CommentsRequest } from '../dto/comment/comments-request';
import { ProjectService } from './project.service';
import SuccessResponse from 'src/common/utils/success.response';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private projectService: ProjectService,
  ) {}

  async getComments(request: CommentsRequest) {
    const { page, itemCount, projectId } = request;
    const skip = (page - 1) * itemCount;
    const take = itemCount;

    return this.commentRepository.find({ where: { projectId }, skip, take });
  }

  async getComment(id: number) {
    return this.commentRepository.findOneBy({ id });
  }

  async createComment(request: CreateCommentDto, user: User): Promise<any> {
    const project = await this.projectService.getProjectById(request.projectId);

    if (!project) {
      throw new NotFoundException(` 이 글은 없는 글입니다.`);
    }

    return this.commentRepository.createComment(request, user);
  }

  async updateComment(
    request: UpdateCommentDto,
    user: User,
  ): Promise<SuccessResponse> {
    const comment = await this.getComment(request.id);

    if (comment.userId !== user.id) {
      throw new NotFoundException(`작성자만 수정이 가능합니다`);
    }

    const updated = await this.commentRepository.update(
      { id: request.id },
      { content: request.comment },
    );

    if (updated.affected === 0) {
      throw new NotFoundException(` 이 글은 수정 할 수 없습니다.`);
    }

    return SuccessResponse.fromSuccess(true);
  }

  async handleLikeComment(id: number, user: User): Promise<SuccessResponse> {
    const comment = await this.getComment(id);

    if (comment.userId !== user.id) {
      throw new NotFoundException(`작성자만 수정이 가능합니다`);
    }

    if (comment.likeUserIds.includes(user.userId)) {
      const updatedLikeUserIds = comment.likeUserIds.filter(
        (userId) => userId !== user.userId,
      );
      comment.likeUserIds = updatedLikeUserIds;
      comment.likeCount -= 1;
      await this.commentRepository.save(comment);
    } else {
      comment.likeUserIds.push(user.userId);
      comment.likeCount += 1;
      await this.commentRepository.save(comment);
    }

    return SuccessResponse.fromSuccess(true);
  }

  async deleteComment(id: number, user: User): Promise<SuccessResponse> {
    const comment = await this.getComment(id);

    if (comment.userId !== user.id) {
      throw new NotFoundException(`작성자만 삭제가 가능합니다`);
    }

    const deleted = await this.commentRepository.delete({ id });

    if (deleted.affected === 0) {
      throw new NotFoundException(`이 댓글은 지울수 없습니다.`);
    }

    return SuccessResponse.fromSuccess(true);
  }
}
