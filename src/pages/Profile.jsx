import {useState } from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {updateDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {Link, useNavigate} from 'react-router-dom';

function Profile() {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const {name, email} = formData;
    const onLogout =()=>{
        auth.signOut();
        navigate('/');
    }

    const onsubmit = ()=>{
        console.log('clicked');
    }

    const onChange= (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value, 
        }));
    }
   
    return <div className='profile'>
        <header className="profileHeader">
            <p className="pageHeader">My Profile</p>
            <button type='button' className="logOut" onClick={onLogout}>
                Logout
            </button>
        </header>
        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p className="changePersonalDetails" onClick={()=>{
                    changeDetails && onsubmit() 
                    setChangeDetails((prevState)=> !prevState)
                }}>{changeDetails? 'done': 'change'}</p>
            </div>
            <div className="profileCard">
                <form>
                    <input type="text" id='name' className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange}/>
                </form>
            </div>
        </main>
    </div>
}

export default Profile;