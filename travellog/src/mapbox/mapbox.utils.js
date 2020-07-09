import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoder from '@mapbox/mapbox-sdk/services/geocoding';

const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiYWl0MG5lIiwiYSI6ImNrYzRteTkweTA5aWIzM21nMndzbzYwNTQifQ.1Wn-afss94YAfckuj6uCBA'
const baseClient = mbxClient({ accessToken: MAPBOX_API_TOKEN})
const geocodingService = mbxGeocoder(baseClient)


export default geocodingService;