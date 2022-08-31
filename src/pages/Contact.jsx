import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify"; 

function Contact() {

    const [message, setMessage]= useState('');
    const [landlord, setLandlord]= useState(null);
    const [searchParams, setSearchParams]= useSearchParams();

    const params = useParams();

    useEffect(()=>{
        const getLandlord= async ()=>{
            const docRef = doc(db, 'users', params.landlordId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                setLandlord(docSnap.data())
            }else{
                toast.error('Could not get landlord data');
            }
        }

        getLandlord();
    },[params.landlordId])

    return ( 
        <div>Contact</div>
     );
}

export default Contact;