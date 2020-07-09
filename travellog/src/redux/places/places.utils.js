export const removeNewPlace = (newPlaces, name) => {
    const filteredPlaces = newPlaces.filter(place => {
        
        console.log(place.name===name)
        return place.id !== name
    })
    return filteredPlaces
}