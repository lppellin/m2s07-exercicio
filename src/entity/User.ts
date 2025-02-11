import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Medicamento } from "./Medicamento";
import { Role } from "./Role";

@Unique(["email"])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  nome: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  senha: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => Medicamento, (medicamento) => medicamento.user)
  medicamentos: Medicamento[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: "user_role" })
  roles: Role[];
}
