const AuthService = {
    isAuthenticated: () => {
      //Check if the accesstoken exists
      const token = sessionStorage.getItem('AccessToken');
      return !!token;
    },

    directHome: (email, token) => {
      /*Since we weren't allowed to alter the backend, I implemented a logic to direct user
      to either client or doctor page by checking the email domain. Otherwise I would have 
      added an entry to the response from login endpoint that includes the user's role, e.g
      "doctor", "staff" or "client", this is the safest method i came up with*/

      /*New entry in 24.1.2024:
      The backend had received an update, i still decided to stick with this solution
      for more easier maintainability, since the routing logic with ID:s would be challenging
      after there'll be added new ID:s.. unless the ID in the login endpoint response would always
      be the same for staff members. But i added the userid also to the check*/

      if ((email.includes('@pets.com') || sessionStorage.getItem('UserID') === 0) 
      && (sessionStorage.getItem('AccessToken') === token)) {
        window.location.href='/doctor-dashboard';
      }

      else {
        window.location.href='/client-dashboard';
      }
    }
  };
  
  export default AuthService;