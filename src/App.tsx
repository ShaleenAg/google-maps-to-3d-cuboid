import { useState} from 'react'
import './App.css';
import { createUseStyles } from 'react-jss'
import { GoogleMap, StandaloneSearchBox, useLoadScript, MarkerF } from '@react-google-maps/api';
import {  Engine, Scene} from 'react-babylonjs';
import { Vector3} from '@babylonjs/core'
import Cuboid from './Cuboid';

const useStyles = createUseStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 50,
  },
  btn: {
    width: 200,
    height: 50,
    color: '#fff',
    alignSelf: 'center'
  }
})


const containerStyle = {
  width: '1200px',
  height: '600px'
}
interface IMapCenter {
  lat: number,
  lng: number
}
type TLibraries = ("places" | "drawing" | "geometry" | "localContext" | "visualization")[]
const libraries: TLibraries = ['places']

function App() {
  const classes = useStyles()
  const [mapCenter, setMapCenter] = useState<IMapCenter>({
    lat: -3.745,
    lng: -38.523
  })
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries
  })
  const [searchbox, setSearchBox] = useState<null | google.maps.places.SearchBox>(null)

  const [showRender, setShowRender] = useState(false)

  const [url, setUrl] = useState(`https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=12&size=400x400&maptype=roadmap&key=${import.meta.env.VITE_MAPS_API_KEY}`)

  const changeURL = (mapCenter: IMapCenter) => setUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=12&size=400x400&maptype=roadmap&key=${import.meta.env.VITE_MAPS_API_KEY}`)

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
      >
        <>
          <StandaloneSearchBox
            onLoad={(ref) => {
              setSearchBox(ref)
            }}
            onPlacesChanged={() => {
              if (searchbox) {
                const places = searchbox.getPlaces()
                if (places) {
                  const place = places[0]
                  const newCenter = {
                    lat: place.geometry?.location?.lat() || 0,
                    lng: place.geometry?.location?.lng() || 0
                  }
                  setMapCenter(newCenter)
                  changeURL(newCenter)
                }

              }
            }}

          >
            <input
              type="text"
              placeholder="Enter Location"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "50%",
                marginLeft: "-120px"
              }}
            />
          </StandaloneSearchBox>
          <MarkerF position={mapCenter} />
        </>
      </GoogleMap>
    )

  }
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return (
    <div className={classes.app}>

      <div className='map'>
        {isLoaded && renderMap()}
      </div>

      <button onClick={() => setShowRender
        (!showRender)} className={classes.btn}>Show Render
      </button>

      {showRender && (<div className="test-babylon">
        <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
          <Scene>
            <arcRotateCamera
              name="camera1"
              target={Vector3.Zero()}
              alpha={Math.PI / 2}
              beta={Math.PI / 4}
              radius={8}
            />
            <hemisphericLight
              name="light1"
              intensity={0.7}
              direction={Vector3.Up()}
            />
            <Cuboid url={url} />
          </Scene>
        </Engine>
      </div>)}
    </div >
  )
}

export default App
