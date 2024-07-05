export interface ScenarioOneBeamOutput {
  /**
   * Unique identifier for the deflection
   */
  id: number;

  /**
   * Width of the beam in millimeters
   */
  beamWidthInM: number;

  /**
   * Height of the beam in millimeters
   */
  beamHeightInM: number;

  /**
   * Length of the beam in millimeters
   */
  beamLengthInM: number;

  /**
   * Mobile support position of the beam in millimeters
   */
  mobileSupportPositionInM: number;

  /**
   * Location for deformation calculation in millimeters
   */
  deformationLocationInM: number;

  /**
   * Force of the beam in kilograms
   */
  force: number;

  /**
   * Result for deflection scenario one
   */
  deflectionOne: number;
}
