export interface ScenarioTwoBeamOutput {
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
   * Location of the mobile force in millimeters
   */
  mobileForceLocationInM: number;

  /**
   * Magnitude of the force
   */
  force: number;

  /**
   * Deflection calculated for scenario two
   */
  deflectionTwo: number;
}
