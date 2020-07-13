import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const config = {
    apiKey: "AIzaSyCWdu-IWNjc5ju40L0buJRoKsH7bnHj5iY",
    authDomain: "travellog-1cc77.firebaseapp.com",
    databaseURL: "https://travellog-1cc77.firebaseio.com",
    projectId: "travellog-1cc77",
    storageBucket: "travellog-1cc77.appspot.com",
    messagingSenderId: "522255153329",
    appId: "1:522255153329:web:0152800c20d163cd37ca90",
    measurementId: "G-4064710Q87"
  };


export const createUserProfileDocument = async (userAuth,data) => {
if (!userAuth) return;

const userRef = firestore.doc(`users/${userAuth.uid}`);
const snapshot = await userRef.get();

if (!snapshot.exists) {
    const {displayName,email} = userAuth;
    const createdAt = new Date()
    try{
        await userRef.set({
            displayName,
            email,
            createdAt,
            avatar:'/defaultAvatar.jpg',
            ...data,
        })

        await firestore
        .collection('avatars')
        .doc(userRef.id)
        .set({
            avatarUrl:'/defaultAvatar.jpg'
        })
    
    } catch (err) {
        console.log('error creating user', err.message)
    }
}
return userRef;

}


export const addPlace =  async (name, longitude, latitude, height, userId) => {
    const ref = await firestore
    .collection('users')
    .doc(userId)
    .collection('places')
    .add({
        name:name,
        longitude: longitude,
        latitude: latitude,
        height: height
    })
    .then(docRef => {
        console.log(docRef)
        return docRef
    })
    .catch(err => {
        console.log(err)
        return null
    })   

    return ref
}

export const removePlace =  (placeId, userId) => {
    return firestore
    .collection('users')
    .doc(userId)
    .collection('places')
    .doc(placeId)
    .delete()
    .then(() => {
        return 1
    })
    .catch(err => {
        console.log(err)
        return null
    })
}

export const getImages = (placeId, userId) => {
    return firestore
    .collection('users')
    .doc(userId)
    .collection('places')
    .doc(placeId)
    .collection('images')
    .orderBy('createdAt', 'desc')
    .get()
    .then(ref => {
        return ref
    })
    .catch(() => {   
        return null
    })
}

export const addImages = async (images, placeId, userId, name, description, dateRange) => {
    const batch = firestore.batch()
    images.forEach(image => {
        if (!image.match(/medium/)) {
            const url = image.split('/')
            const imageRef = firestore
            .collection('users')
            .doc(userId)
            .collection('places')
            .doc(placeId)
            .collection('images')
            .doc(url[2])
            batch.set(imageRef, {
                imageUrl: image,
                mediumImageUrl: url[0]+'/'+url[1]+'/medium-'+url[2],
                createdAt: new Date()
            })
            if (name) {
                const placeRef = firestore
                .collection('users')
                .doc(userId)
                .collection('places')
                .doc(placeId)
                batch.update(placeRef, {
                    name: name,
                    description:description,
                    dateRange: dateRange
                })
            }
        }    
    })
    return batch.commit()
}

export const removeImage = (userId, placeId, imageId) => {
    return firestore
    .collection('users')
    .doc(userId)
    .collection('places')
    .doc(placeId)
    .collection('images')
    .doc(imageId)
    .delete()
    .then(() => {
        return 1
    })
    .catch(err => {
        console.log(err)
        return null
    })
}

export const editPlace = (userId, placeId, newName, newDescription) => {
    return firestore
    .collection('users')
    .doc(userId)
    .collection('places')
    .doc(placeId)
    .update({
        name: newName,
        description: newDescription
    })
    .then(() => {
        return 1
    })
    .catch(err=> {
        console.log(err)
        return null
    })
}

firebase.initializeApp(config);


export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({prompt:'select_account'});
export const signInwithGoogle = () => auth.signInWithPopup(googleProvider)

export const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.setCustomParameters({prompt:'select_account'});
export const signInWithFacebook = () => auth.signInWithPopup(facebookProvider)

export const emailProvider = firebase.auth.EmailAuthProvider

export default firebase;