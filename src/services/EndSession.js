const EndSession = {
  logOut: (props) => {
    //Remove accesstoken and username from sessionstorage
    sessionStorage.removeItem('AccessToken');
    sessionStorage.removeItem('Username_for_petclinic');
    sessionStorage.removeItem('UserID');

    //Redirect to the login page
    window.location.href='/login';
   },
 };
 
export default EndSession;