"use client";
import React from 'react';
import { createRoot } from "react-dom/client";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import page from '@/app/page';

const App = () => (
    <>

          <button
       id='location-button'
        className="z-10 bg-[#2C80FF] hover:bg-[#1a6fd8] text-white font-bold py-3 px-6 rounded-[25px] transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{ fontFamily: "'Rammetto One', cursive" }}
        onClick={() => {
          navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
          });
        }}
      >
        Permitir localização
      </button>

        <APIProvider apiKey={'AIzaSyDL7aYeSALaJz6Ri3f0EE8J0TbpOzFl0S4'} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={10}
                defaultCenter={ { lat: -15.7801, lng: -47.9292 } }
            />
        </APIProvider>
    </>

);

export default App;