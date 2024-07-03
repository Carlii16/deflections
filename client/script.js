document.addEventListener('DOMContentLoaded', function () {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const signOutLink = document.getElementById('signOutLink');
  const signInLink = document.getElementById('signInLink');
  const signUpLink = document.getElementById('signUpLink');

  const apiUrl = 'http://localhost:3001';

  const token = localStorage.getItem('token');
  if (token) {
    showAuthenticatedState();
  } else {
    showUnauthenticatedState();
  }

  if (signInForm) {
    signInForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(signInForm);
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const response = await fetch(`${apiUrl}/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Invalid email or password. Please try again.',
          );
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log(data.token);
        showAuthenticatedState();

        window.location.href = 'index.html';
      } catch (error) {
        console.error('Sign In Error:', error);
        alert(error.message);
      }
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(signUpForm);
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Failed to register. Please try again.',
          );
        }

        // Optionally, you can show a success message or handle the UI accordingly
        alert('Registration successful. Please sign in.');
        signUpForm.reset(); // Clear the sign-up form fields
      } catch (error) {
        console.error('Sign Up Error:', error);
        alert(error.message);
      }
    });
  }

  if (signOutLink) {
    signOutLink.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('token'); // Remove the access token
      showUnauthenticatedState();
      // Redirect to a new page or refresh the current one after sign-out
      location.href = 'signin.html';
    });
  }

  // Helper functions to show/hide elements based on authentication state
  function showAuthenticatedState() {
    if (signInLink) signInLink.style.display = 'none';
    if (signUpLink) signUpLink.style.display = 'none';
    if (signOutLink) signOutLink.style.display = 'block';
  }

  function showUnauthenticatedState() {
    if (signInLink) signInLink.style.display = 'block';
    if (signUpLink) signUpLink.style.display = 'block';
    if (signOutLink) signOutLink.style.display = 'none';
  }
});
