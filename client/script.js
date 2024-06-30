document.addEventListener('DOMContentLoaded', function () {
  function handleScenarioForm(formId, endpoint, resultId) {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const beamLengthInMetersInput =
          document.getElementById('beamLengthInMeters');
        const fixedEndLocationInMmInput = document.getElementById(
          'fixedEndLocationInMm',
        );
        const mobileForceLocationInMmInput = document.getElementById(
          'mobileForceLocationInMm',
        );
        const forceInput = document.getElementById('force');

        if (
          !beamLengthInMetersInput ||
          !fixedEndLocationInMmInput ||
          !mobileForceLocationInMmInput ||
          !forceInput
        ) {
          console.error('One or more form inputs not found.');
          return;
        }

        const parameters = {
          beamLengthInMeters: beamLengthInMetersInput.value,
          fixedEndLocationInMm: fixedEndLocationInMmInput.value,
          mobileForceLocationInMm: mobileForceLocationInMmInput.value,
          force: forceInput.value,
        };

        try {
          const response = await fetch(
            `http://localhost:3001/deflections/${endpoint}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(parameters),
            },
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }

          const result = await response.json();
          document.getElementById(
            resultId,
          ).innerText = `Deflection: ${result.deflection}`;
        } catch (error) {
          alert(`Failed to calculate ${endpoint}. Please try again.`);
          console.error(`${endpoint} calculation error:`, error);
        }
      });
    } else {
      console.error(`Form with ID '${formId}' not found.`);
    }
  }

  handleScenarioForm('scenario1-form', 'scenario-one', 'scenario1-result');
  handleScenarioForm('scenario2-form', 'scenario-two', 'scenario2-result');
  handleScenarioForm('scenario3-form', 'scenario-three', 'scenario3-result');
});
