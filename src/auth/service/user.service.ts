import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/response/user/users.response';
import { UserListRequest } from '../dto/request/user/users.request';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async getAllUser(request: UserListRequest): Promise<> {
    return this.userRepository.find({});
  }

  async getOneUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  async updateUser(id: number, userDTO: UserDTO) {
    const user = await this.userRepository.update(id, userDTO);

    if (user.affected === 0) {
      throw new NotFoundException(`${id} 이 유저는 수정할 수 없습니다.`);
    }
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.delete(id);

    if (user.affected === 0) {
      throw new NotFoundException(`${id} 이 유저는 지울 수 없습니다.`);
    }
  }
}
