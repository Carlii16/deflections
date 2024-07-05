document.addEventListener('DOMContentLoaded', function () {
  const scenarioThreeForm = document.getElementById('scenarioThreeForm');
  const resultElement = document.getElementById('scenarioThreeResult');

  const apiUrl = 'http://localhost:3001';

  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    alert('You must be signed in to perform this action.');
    location.href = 'signin.html';
    return;
  }

  if (scenarioThreeForm) {
    scenarioThreeForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const beamWidthForMomentOfInertiaInM = parseFloat(
        document.getElementById('beamWidthForMomentOfInertiaInM').value,
      );

      const beamLengthInM = parseFloat(
        document.getElementById('beamLengthInM').value,
      );
      const beamWidthInM = parseFloat(
        document.getElementById('beamWidthInM').value,
      );
      const beamHeightInM = parseFloat(
        document.getElementById('beamHeightInM').value,
      );
      const deformationLocationInM = parseFloat(
        document.getElementById('deformationLocationInM').value,
      );
      const mobileForceLocationInM = parseFloat(
        document.getElementById('mobileForceLocationInM').value,
      );
      const force = parseFloat(document.getElementById('force').value);

      try {
        const response = await fetch(`${apiUrl}/deflections/scenario-three`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            beamLengthInM,
            beamWidthInM,
            beamHeightInM,
            beamWidthForMomentOfInertiaInM,
            deformationLocationInM,
            mobileForceLocationInM,
            force,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'An error occurred');
        }

        const data = await response.json();
        resultElement.textContent = `Deflection: ${data.deflectionThree} m`;
      } catch (error) {
        console.error('Error in calculation:', error);
        alert(error.message);
      }
    });
  }
});
