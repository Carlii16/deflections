document.addEventListener('DOMContentLoaded', function () {
  const scenarioTwoForm = document.getElementById('scenarioTwoForm');
  const resultElement = document.getElementById('scenarioTwoResult');

  const apiUrl = 'http://localhost:3001';

  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    alert('You must be signed in to perform this action.');
    location.href = 'signin.html';
    return;
  }

  if (scenarioTwoForm) {
    scenarioTwoForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const beamWidthInM = parseFloat(
        document.getElementById('beamWidthInM').value,
      );
      const beamLengthInM = parseFloat(
        document.getElementById('beamLengthInM').value,
      );
      const mobileSupportPositionInM = parseFloat(
        document.getElementById('mobileSupportPositionInM').value,
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
        const response = await fetch(`${apiUrl}/deflections/scenario-two`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            mobileSupportPositionInM,
            beamLengthInM,
            beamWidthInM,
            beamHeightInM,
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
        resultElement.textContent = `Deflection: ${data.deflectionTwo} m`;
      } catch (error) {
        console.error('Error in calculation:', error);
        alert(error.message);
      }
    });
  }
});
