import { Deflection } from 'src/interface/entities/deflection';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeflectionEntity implements Deflection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamWidthInMm: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamHeightInMm: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamLengthInMm: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamWeightInKg: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  mobileForceLocationInMm: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  force: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  deformationLocationInMm: number;

  @Column({ type: 'decimal', precision: 65, nullable: true })
  deflectionOne: number;

  @Column({ type: 'decimal', precision: 65, nullable: true })
  deflectionTwo: number;

  @Column({ type: 'decimal', precision: 65, nullable: true })
  deflectionThree: number;
}
