import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {doc, setDoc,getDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
    const location = useLocation();
    const navigate = useNavigate();

    const onGoogleclick = async () =>{
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth,provider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if(!userSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }
            navigate('/')
        } catch (error) {
            toast.error('Could not Authorize with Google');
        }
    }

    return <div className="socialLogin">
        <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
        <button className="socialIconDiv" onClick={onGoogleclick}>
            <img className='socialIconImg' src={googleIcon} alt="google singin" />
        </button>
    </div>
}

export default OAuth;