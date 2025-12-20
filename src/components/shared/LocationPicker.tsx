import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
  title?: string;
}

function LocationMarker({ position, onPositionChange }: { 
  position: [number, number]; 
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPos);
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <Marker
      position={markerPosition}
      draggable={true}
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker) {
            const pos = marker.getLatLng();
            setMarkerPosition([pos.lat, pos.lng]);
            onPositionChange(pos.lat, pos.lng);
          }
        },
      }}
    />
  );
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const LocationPicker = ({ 
  isOpen, 
  onClose, 
  onSelectLocation, 
  initialAddress = '',
  title = 'Select Location'
}: LocationPickerProps) => {
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [selectedLat, setSelectedLat] = useState<number>(13.0827);
  const [selectedLng, setSelectedLng] = useState<number>(80.2707);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          setSelectedLat(lat);
          setSelectedLng(lng);
          getAddressFromLatLng(lat, lng);
        },
        () => {
          getAddressFromLatLng(13.0827, 80.2707);
        }
      );
    }
  }, [isOpen]);

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setSelectedAddress(data.display_name);
        setSelectedLat(lat);
        setSelectedLng(lng);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchInput) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1`
      );
      const data = await response.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapCenter([lat, lng]);
        setSelectedLat(lat);
        setSelectedLng(lng);
        setSelectedAddress(data[0].display_name);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePositionChange = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    getAddressFromLatLng(lat, lng);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          handlePositionChange(lat, lng);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (selectedAddress && selectedLat !== null && selectedLng !== null) {
      onSelectLocation(selectedAddress, selectedLat, selectedLng);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Click on the map or drag the marker to select your location
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Box */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search for a location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
            <Button 
              onClick={handleCurrentLocation} 
              variant="outline" 
              size="icon"
              disabled={isLoading}
              title="Use current location"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div className="w-full h-[400px] rounded-lg border border-border overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={[selectedLat, selectedLng]} 
                  onPositionChange={handlePositionChange}
                />
                <RecenterMap center={mapCenter} />
              </MapContainer>
            </div>
          </div>

          {/* Selected Address Display */}
          {selectedAddress && (
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Selected Location</p>
                <p className="text-sm text-muted-foreground">{selectedAddress}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedAddress}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
