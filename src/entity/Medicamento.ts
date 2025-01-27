import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  nome: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  @Column({ type: "int", nullable: false })
  quantidade: number;

  @Column({ type: "int", nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.medicamentos)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
