export interface Deflection {
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
   * Location of the mobile force in millimeters
   */
  mobileForceLocationInM: number;

  /**
   * Magnitude of the force
   */
  force: number;

  beamWidthForMomentOfInertiaInM: number;

  /**
   *  Location for deformation calculation in millimeters
   */
  deformationLocationInM: number;

  /**
   * Deflection calculated for scenario one
   */
  deflectionOne: number;

  /**
   * Deflection calculated for scenario two
   */
  deflectionTwo: number;

  /**
   * Deflection calculated for scenario three
   */
  deflectionThree: number;
}
