import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {doc, setDoc,getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
    const location = useLocation();
    const navigation = useNavigate();

    const onGoogleclick = () =>{
        
    }

    return <div className="socialLogin">
        <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
        <button className="socialIconDiv" onClick={onGoogleclick}>
            <img src={googleIcon} alt="google singin" />
        </button>
    </div>
}

export default OAuth;