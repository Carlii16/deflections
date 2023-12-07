export interface ScenarioOneBeamOutput {
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

  /* Result for deflection scenario one */
  deflectionOne: number;
}
