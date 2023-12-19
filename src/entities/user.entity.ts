import { User } from 'src/interface/entities/user';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  password: string;
}
