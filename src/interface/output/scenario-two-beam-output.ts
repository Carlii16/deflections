export interface ScenarioTwoBeamOutput {
  /* Unique identifier for the deflection */
  id: number;

  /* Width of the beam in millimeters */
  beamWidthInMm: number;

  /* Height of the beam in millimeters */
  beamHeightInMm: number;

  /* Length of the beam in millimeters */
  beamLengthInMm: number;

  /* Weight of the beam in kilograms */
  beamWeightInKg: number;

  /* Location for deformation calculation in millimeters */
  deformationLocationInMm: number;

  /* Location of the mobile force in millimeters */
  mobileForceLocationInMm: number;

  /* Magnitude of the force */
  force: number;

  /* Deflection calculated for scenario two */
  deflectionTwo: number;
}
