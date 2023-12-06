import { Deflection } from 'src/interface/entities/deflection';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class DeflectionEntity implements Deflection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 2 })
  beamWidthInMm: number;

  @Column({ type: 'decimal', precision: 2 })
  beamHeightInMm: number;

  @Column({ type: 'decimal', precision: 2 })
  beamLengthInMm: number;

  @Column({ type: 'decimal', precision: 2 })
  beamWeightInKg: number;

  @Column({ type: 'decimal', precision: 2 })
  mobileForceLocationInMm: number;

  @Column({ type: 'decimal', precision: 2 })
  force: number;

  @Column({ type: 'decimal', precision: 2 })
  deformationLocationInMm: number;

  @Column({ type: 'decimal', precision: 2 })
  deflectionOne: number;

  @Column({ type: 'decimal', precision: 2 })
  deflectionTwo: number;

  @Column({ type: 'decimal', precision: 2 })
  deflectionThree: number;
}
