
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import '../assets/styles/components/SelectPlace.scss';
import { LOCATIONIQ } from '../utils/ultils';
import AsyncSelect from 'react-select/async';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
  
  const LOCATIONIQ_API_KEY = LOCATIONIQ; // Replace with your actual API key
  
  const SelectPlace = ({onChange,defaultValue = null }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [defaultOption, setDefaultOption] = useState(null);
  
    useEffect(() => {
      // If defaultValue is provided, fetch its details
      const fetchDefaultLocation = async () => {
        if (defaultValue) {
          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(defaultValue)}&format=json`
            );
  
            if (!response.ok) {
              throw new Error('Search failed');
            }
  
            const data = await response.json();
            
            // If location found, set the default option
            if (data && data.length > 0) {
              const location = data[0];
              const defaultLocationOption = {
                value: location.place_id,
                label: location.display_place,
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon),
                fullAddress: location.display_name
              };
  
              setDefaultOption(defaultLocationOption);
              setSelectedLocation({
                lat: defaultLocationOption.lat,
                lon: defaultLocationOption.lon,
                fullAddress: defaultLocationOption.fullAddress
              });
              onChange(defaultLocationOption.fullAddress);
            }
          } catch (error) {
            console.error('Error fetching default location:', error);
          }
        }
      };
  
      fetchDefaultLocation();
    }, [defaultValue, onChange]);
  
    const loadOptions = async (inputValue) => {
      if (inputValue.length < 3) return [];
  
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(inputValue)}&format=json`
        );
  
        if (!response.ok) {
          throw new Error('Search failed');
        }
  
        const data = await response.json();
  
        return data.map(location => ({
          value: location.place_id,
          label: location.display_place,
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
          fullAddress: location.display_name
        }));
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    };
  
    const handleLocationChange = (selectedOption) => {
      if (selectedOption) {
        setSelectedLocation({
          lat: selectedOption.lat,
          lon: selectedOption.lon,
          fullAddress: selectedOption.fullAddress
        });
        onChange(selectedOption.fullAddress);
      }
    };
  
    return (
      <div className="location-search-wrapper">
        <div className="search-container">
          <div className="search-input">
            <AsyncSelect
              loadOptions={loadOptions}
              onChange={handleLocationChange}
              placeholder="Tìm kiếm địa điểm..."
              noOptionsMessage={() => "Không tìm thấy địa điểm"}
              loadingMessage={() => "Đang tìm kiếm..."}
              debounceTimeout={300}
              className="location-select"
              value={defaultOption}
            
            />
          </div>
  
          <div className="map-container">
            {selectedLocation ? (
              <MapContainer
                center={[selectedLocation.lat, selectedLocation.lon]}
                zoom={13}
                className="leaflet-map"
                key={`${selectedLocation.lat}-${selectedLocation.lon}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                  <Popup>
                    {selectedLocation.fullAddress}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                <p>Chọn địa điểm để hiển thị bản đồ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default SelectPlace;