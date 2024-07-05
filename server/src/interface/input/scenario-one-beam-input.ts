export interface ScenarioOneBeamInput {
  /**
   * Mobile support position of the beam in millimeters
   */
  mobileSupportPositionInM: number;

  /**
   * Height of the beam in millimeters
   */
  beamHeightInM: number;

  /**
   * Length of the beam in millimeters
   */
  beamLengthInM: number;

  /**
   * Force of the beam in kilograms
   */
  force: number;

  /**
   * Location for deformation calculation in millimeters
   */
  deformationLocationInM: number;
}
