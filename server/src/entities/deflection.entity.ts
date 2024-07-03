import { Deflection } from 'server/src/interface/entities/deflection';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeflectionEntity implements Deflection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamWidthInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamHeightInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamLengthInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamWidthForMomentOfInertiaInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  beamWeightInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  mobileForceLocationInM: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  force: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  deformationLocationInM: number;

  @Column({ type: 'decimal', precision: 18, scale: 15, nullable: true })
  deflectionOne: number;

  @Column({ type: 'decimal', precision: 18, scale: 15, nullable: true })
  deflectionTwo: number;

  @Column({ type: 'decimal', precision: 18, scale: 15, nullable: true })
  deflectionThree: number;
}
