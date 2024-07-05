document.addEventListener('DOMContentLoaded', function () {
  const scenarioOneForm = document.getElementById('scenarioOneForm');
  const resultElement = document.getElementById('scenarioOneResult');

  const apiUrl = 'http://localhost:3001';

  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    alert('You must be signed in to perform this action.');
    location.href = 'signin.html';
    return;
  }

  if (scenarioOneForm) {
    scenarioOneForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const force = parseFloat(document.getElementById('force').value);
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

      try {
        const response = await fetch(`${apiUrl}/deflections/scenario-one`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            force,
            beamLengthInM,
            beamWidthInM,
            beamHeightInM,
            deformationLocationInM,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'An error occurred');
        }

        const data = await response.json();
        resultElement.textContent = `Deflection: ${data.deflectionOne} m`;
      } catch (error) {
        console.error('Error in calculation:', error);
        alert(error.message);
      }
    });
  }
});
