import {auth} from '../firebase-config.js'
import {signInAnonymously, onAuthStateChanged} from 'firebase/auth'

import Cookies from 'universal-cookie'
const cookies = new Cookies();

export const Auth = (props) => {
  const { setIsAuth } = props

  const signInAsGuest = async() => {
    await signInAnonymously(auth)
    .then(() => {
      setIsAuth(true);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // const uid = user.uid;
      cookies.set("auth-token", user.refreshToken);
    } else {
      console.log('signed out');
    }
  });

  return (
    <div className='auth'>
      <p> Sign In As Guest To Continue </p>
      <button onClick={signInAsGuest}>Sign In As Guest </button>
    </div>
  );
}