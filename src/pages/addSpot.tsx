import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import AddSpotForm from '../components/addSpotForm';
import Header from '../components/header';
import Map from '../components/map';
import {getSpot, addSpot, deleteImage, getImage, getUser, editSpot, addImage, getImages, updateMainImage} from '../api-service'
import '../styles/addSpot.css';
import '../styles/spot.css';
import { getAddress } from '../utils';
import {mapCenter} from '../components/map'
import LogInModal from '../components/logInModal'
import {UserContext} from '../providers/userProvider';
import { useHistory } from "react-router-dom";
import queryString from 'query-string'
import EmailVerificationModal from '../components/emailVerificationModal'
import {storage} from '../firebase'
import {IImage, IUser, ISpot, IToDbSpot, IImagePreUploade} from '../types/types'

function AddSpot() {
    const [spotName, setSpotName] = useState("")
    const [aboutSpot, setAboutSpot] = useState("")
    const [approachSpot, setApproachSpot] = useState("")
    const [facbookPageSpot, setFacebookPageSpot] = useState("")
    const [spotId, setSpotId] = useState(0);
    const [spot, setSpot] = useState(null)
    const [images, setImages] = useState<IImage[]>([])
    //const [newImages, setNewImages] = useState([]);

    const [latLng, setLatLng] = useState(mapCenter);
    const [address, setAddress] = useState('Dra markøren på kartet for å velge addresse')

    const [mainImage, setMainImage] = useState(undefined);

    const [showLogInModal, setShowLogInModal] = useState(false);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const user = useContext(UserContext)

    const [isLoading, setIsLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)

    document.title = `Windsurf Norge - Legg til/endre spot`

    useEffect(() => {
        const fetchSpot = async () => {
            const spotName = queryString.parse(window.location.search).spotName
            const edit = queryString.parse(window.location.search).edit
            if(edit) {
                setIsEdit(true)
                //@ts-ignore TODO
                const spot = await getSpot(spotName);
                const images = await getImages(spot.id)
                setSpot(spot);
                setSpotId(spot.id)
                setSpotName(spot.name);
                setAboutSpot(spot.about);
                setApproachSpot(spot.approach);
                setFacebookPageSpot(spot.facebook)
                setLatLng([spot.lng, spot.lat])
                const address = await getAddress(spot.lat, spot.lng)
                setAddress(address);
                setImages(images)
                setMainImage(spot.main_image);
            }
            setIsLoading(false)
        }
        fetchSpot();
    }, [user])

    const history = useHistory()

    useEffect(() => {
        if(user === null){
            setShowLogInModal(true);
        }
        else{
            setShowLogInModal(false);
        }
        if(user && !user.emailVerified){
            setShowEmailVerificationModal(true);
        }
    }, [user] )

    //TODO fix any type
    const dragEnd = async (pos: any) => {
        const address = await getAddress(pos.lng, pos.lat)
        setLatLng([pos.lng, pos.lat])
        setAddress(address)
      }

    const onDeleteImage = async (imageId: number) => {        
        try{
            const image = await getImage(imageId)
            storage.refFromURL(image.big_image).delete()
            storage.refFromURL(image.small_image).delete()

            const newImages = images.filter((oldImage:IImage) => oldImage.id !== image.id)
            
            //@ts-ignore TODO
            if(spot.main_image === imageId){
                //@ts-ignore TODO
                updateMainImage(null, spot.id)
            }

            deleteImage(imageId)
            setImages(newImages)
        }
        catch(error){
            console.error("Could not delete image", error)
        }
    }

        const checkValid = () => {
        if (spotName === '' || latLng === mapCenter) {
            window.alert('Legg til navn og dra markøren til spottents posisjon');
            return false
        }
        return true
    }

    const addImages = async (spotId: number, dbUser: IUser) => {
        const newImages: IImage[] = images.filter((image:IImage) => image.id === undefined)
        for(const image of newImages) {
            const newImage: IImagePreUploade = {big_image: image.big_image, small_image: image.small_image}
            await addImage(newImage, spotId, dbUser.id)
        }
        //@ts-ignore TODO
        if(newImages.length !== 0 && (spot === null || spot.mainImage === undefined)){
            const images = await getImages(spotId)
            updateMainImage(images[0].id, spotId)
        }
    }

    const onSubmit = async () => {
        const dbUser = await getUser(user.email);
        let spot: ISpot | IToDbSpot = {
            name: spotName,
            about: aboutSpot,
            approach: approachSpot,
            facebook: facbookPageSpot,
            lat: latLng[1],
            lng: latLng[0],
            current_user_id: dbUser.id,
            main_image: mainImage
        }
        if(checkValid()){
            if(isEdit){
                spot = {...spot, id: spotId}
                editSpot(spot)
                //@ts-ignore TODO
                addImages(spot.id, dbUser)
            }
            else{
                spot = {...spot, createdby: dbUser.id}
                await addSpot(spot)
                const newSpot = await getSpot(spotName)
                addImages(newSpot.id, dbUser)
            }
            history.push('/')
        }
    }

    return(
        <div>
            <Header
                title={isEdit ? "Endre spot" : "Legg til spot"}
                //@ts-ignore TODO
                image={spot && spot.big_image}
            />
            {!isLoading &&
                <> 
                    <div className="spot-container-edit">
                        <div className="spot-map-container">
                            <Map draggable={true} onDragEnd={dragEnd} markerPos={latLng}/>
                        </div>
                        <div className="addSpot-spotInfo">
                            <AddSpotForm 
                                onSubmit={onSubmit} 
                                onNameChange={setSpotName}
                                onAboutChange={setAboutSpot}
                                onApproachChange={setApproachSpot}
                                onFacebookPageChange = {setFacebookPageSpot}
                                address = {address}
                                name= {spotName}
                                about = {aboutSpot}
                                approach = {approachSpot}
                                facebook = {facbookPageSpot}
                                isEdit ={isEdit}
                                mainImage = {mainImage}
                                setMainImage = {setMainImage}
                                onDeleteImage = {onDeleteImage}
                                images = {images}
                                setImages = {setImages}
                                //newImages = {newImages}
                                //setNewImages = {setNewImages}
                            />
                        </div>
                    </div>
                    {/*@ts-ignore */}
                    <LogInModal show={showLogInModal} onHide={() => {setShowLogInModal(false); history.push('/')}}/>
                    <EmailVerificationModal show={showEmailVerificationModal} onHide={() => {setShowLogInModal(false); history.push('/')}} user={user}/>
                </>
            }
        </div>
    )
    
}

export default withRouter(AddSpot);