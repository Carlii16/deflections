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
   * Weight of the beam in kilograms
   */
  beamWeightInM: number;

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
