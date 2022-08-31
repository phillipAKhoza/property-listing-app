import { useState, useEffect, useRef } from "react";
import {getAuth,onAuthStateChanged} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import Spinner from '../components/Spinner';
import {toast} from 'react-toastify';

function CreateListing() {

    const [geoLocationEnabled,setGeoLocationEnabled ] =useState(true);

    const [formData, setFormData] = useState({
        type:'rent',
        name:'',
        bedrooms:1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images:{},
        latitude: 0,
        longitude:0
        
    });
    const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountedPrice,images,latitude,longitude} = formData;
    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (e) =>{
        e.preventDefault()

        setLoading(true);

        if(discountedPrice>=regularPrice){
            setLoading(false);
            toast.error('Discounted Price must be less than Regular price');
            return
        }

        if(images.length> 6){
            setLoading(false);
            toast.error('Exceeded Max number of Images(6)');
            return
        }

        let geolocation ={}
        let location;

        if(geoLocationEnabled){
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json()

            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location= data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;

            if(location === undefined || location.includes('undefined')){
                setLoading(false)
                toast.error('Sorry! your Address is not recognised')
                return
            }

        }else{
            geolocation.lat = latitude;
            geolocation.lng = longitude;
            location = address;
        }

        setLoading(false)
    }
    const onMutate = (e) =>{
    // buttons
        let boolean = null;

        if(e.target.value === 'true'){
            boolean = true
        }

        if(e.target.value === 'false'){
            boolean = false
        }
    // files
    if(e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            images: e.target.files
        }))
    }

    // Text/Boolean/Numbers
    if(!e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value 
        }))
    }
    }
    
    useEffect(()=>{
        if(isMounted){
            onAuthStateChanged(auth,(user)=>{
                if(user){
                   setFormData({...formData, userRef: user.uid});
                }else{
                    navigate('/sign-in')
                }
            })
        }

        return ()=>{
            isMounted.current = false;
        }
    },[isMounted]);

    if(loading){
        return <Spinner/>
    }
    

    return ( 
        <div className="profile">
            <header>
            <p className="pageHeader">Create a Listing</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                <label className="formLabel">Sell / Rent</label>
                <div className="formButtons">
                    <button type="button" id="type" 
                    className={type ==='sale'? 'formButtonActive' : 'formButton'}
                    value='sale'
                    onClick={onMutate}
                    >
                        Sell
                    </button>
                    <button type="button" id="type" 
                    className={type ==='rent'? 'formButtonActive' : 'formButton'}
                    value='rent'
                    onClick={onMutate}
                    >
                        Rent
                    </button>
                </div>
                <label className="formLabel">Name</label>
                <input className="formInputName" type="text" id="name" value={name} onChange={onMutate} maxLength='32' minLength='10' required/>
                <div className="formRooms flex">
                    <div>
                        <label className="formLabel">Bedrooms</label>
                        <input className="formInputSmall" type="number" id="bedrooms" value={bedrooms} onChange={onMutate} min='1' max='50' required/>
                    </div>
                    <div>
                        <label className="formLabel">Bathrooms</label>
                        <input className="formInputSmall" type="number" id="bathrooms" value={bathrooms} onChange={onMutate} min='1' max='50' required/>
                    </div>
                </div>
                <label className="formLabel">Parking spot</label>
                <div className="formButtons">
                    <button
                        className={parking ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onMutate}
                        min='1'
                        max='50'
                    >
                        Yes
                    </button>
                    <button
                        className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='parking'
                        value={false}
                        onClick={onMutate}
                        min='1'
                        max='50'
                    >
                        No 
                    </button>
                </div>
                <label className="formLabel">Furnished</label>
                <div className="formButtons">
                    <button
                        className={furnished ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='furnished'
                        value={false}
                        onClick={onMutate}
                    >
                        No 
                    </button>
                </div>
                <label className="formLabel">Address</label>
                <textarea 
                    className="formInputAddress"
                    type='text'
                    id='address'
                    onChange={onMutate}
                    required
                />

                {!geoLocationEnabled && (
                    <div className="formLatLng flex">
                        <div>
                            <label className="formLabel">Latitude</label>
                            <input type="number" className="formInputSmall" id='latitude' value={latitude} onChange={onMutate}  required/>
                        </div>
                        <div>
                            <label className="formLabel">Longitude</label>
                            <input type="number" className="formInputSmall" id='longitude' value={longitude} onChange={onMutate}  required/>
                        </div>
                    </div>
                )}

                <label className="formLabel">Offer</label>
                <div className="formButtons">
                    <button
                        className={offer ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                    >
                        No 
                    </button>
                </div>
                <label className="formLabel">Regular price</label>
                <div className="formPriceDiv">
                    <input 
                    type="number" 
                    className="formInputSmall" 
                    id="regularPrice"
                    value={regularPrice}
                    min='50'
                    max='75000000'
                    onChange={onMutate}
                    required
                    />
                    {type === 'rent' &&(
                        <p className="formPriceText">R / Month</p>
                    )}
                </div>
                {offer &&(
                    
                    <>
                     <label className="formLabel">Discounted price</label>
                         <input 
                         type="number" 
                         className="formInputSmall" 
                         id="discountedPrice"
                         value={discountedPrice}
                         min='50'
                         max='75000000'
                         onChange={onMutate}
                         required={offer}
                         />
                    </>
                )}
                <label className="formLabel">Images</label>
                <p className="imageInfo">The first image will be the cover (max 6).</p>
                <input className="formInputFile" type="file" id="images" onChange={onMutate} max='6' accept=".jpg,.png,.jpeg" multiple required/>
                <button type="submit" className="primaryButton CreateListingButton">Create Listing</button>
                </form>
            </main>
        </div>
     );
}

export default CreateListing;