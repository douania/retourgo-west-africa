
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import MapboxMap from "@/components/map/MapboxMap";
import { MapMarker } from "@/components/map/types";

const MapSection = () => {
  // Simulating freight data points
  const freightMarkers: MapMarker[] = [
    { id: '1', position: { lat: 14.7167, lng: -17.4677 }, type: 'freight', label: 'Textile, 500kg' },
    { id: '2', position: { lat: 14.6937, lng: -17.4441 }, type: 'freight', label: 'Électronique, 200kg' },
    { id: '3', position: { lat: 14.7337, lng: -17.4877 }, type: 'freight', label: 'Alimentaire, 1000kg' },
    { id: '4', position: { lat: 14.6967, lng: -17.4877 }, type: 'freight', label: 'Construction, 2000kg' },
    { id: '5', position: { lat: 14.7397, lng: -17.4341 }, type: 'freight', label: 'Médical, 100kg' },
  ];

  const transportMarkers: MapMarker[] = [
    { id: '6', position: { lat: 14.7267, lng: -17.4577 }, type: 'vehicle', label: 'Camion, 3T' },
    { id: '7', position: { lat: 14.6837, lng: -17.4541 }, type: 'vehicle', label: '4x4, 1T' },
    { id: '8', position: { lat: 14.7437, lng: -17.4777 }, type: 'vehicle', label: 'Camionnette, 1.5T' },
  ];

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleMarkerClick = (marker: MapMarker) => {
    // Construire les données de l'élément sélectionné
    if (marker.type === 'freight') {
      const freightIndex = parseInt(marker.id) - 1;
      setSelectedItem({
        itemType: 'freight',
        type: ['Textile', 'Électronique', 'Alimentaire', 'Construction', 'Médical'][freightIndex % 5],
        weight: ['500kg', '200kg', '1000kg', '2000kg', '100kg'][freightIndex % 5],
        ...marker
      });
    } else {
      const transportIndex = parseInt(marker.id) - 6;
      setSelectedItem({
        itemType: 'transport',
        type: ['Camion', '4x4', 'Camionnette'][transportIndex % 3],
        capacity: ['3T', '1T', '1.5T'][transportIndex % 3],
        ...marker
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trouvez du fret en temps réel
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Notre carte interactive vous permet de visualiser les opportunités de fret disponibles 
            à proximité et d'optimiser vos trajets retour.
          </p>
        </div>

        <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <MapboxMap 
            height="h-[500px]"
            initialPosition={{ lat: 14.7167, lng: -17.4677 }} // Dakar
            zoom={14}
            markers={[...freightMarkers, ...transportMarkers]}
            onMarkerClick={handleMarkerClick}
            showCurrentLocation={true}
            title="Carte des frets et transporteurs"
          />
          
          {/* Map legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-retourgo-orange rounded-full mr-2"></div>
              <span className="text-xs text-gray-700">Fret disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-retourgo-green rounded-full mr-2"></div>
              <span className="text-xs text-gray-700">Transporteur disponible</span>
            </div>
          </div>
        </div>
        
        {/* Item details card */}
        {selectedItem && (
          <Card className="mt-6 p-6 max-w-md mx-auto animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedItem.itemType === 'freight' ? 'Détails du fret' : 'Détails du transporteur'}
            </h3>
            {selectedItem.itemType === 'freight' ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Type: <span className="font-medium text-gray-900">{selectedItem.type}</span></p>
                <p className="text-sm text-gray-500">Poids: <span className="font-medium text-gray-900">{selectedItem.weight}</span></p>
                <p className="text-sm text-gray-500">Distance: <span className="font-medium text-gray-900">45 km</span></p>
                <p className="text-sm text-gray-500">Prix: <span className="font-medium text-gray-900">120 000 FCFA</span></p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Véhicule: <span className="font-medium text-gray-900">{selectedItem.type}</span></p>
                <p className="text-sm text-gray-500">Capacité: <span className="font-medium text-gray-900">{selectedItem.capacity}</span></p>
                <p className="text-sm text-gray-500">Note: <span className="font-medium text-gray-900">★★★★☆ (4.2/5)</span></p>
                <p className="text-sm text-gray-500">Disponible dans: <span className="font-medium text-gray-900">30 min</span></p>
              </div>
            )}
            <button 
              className="mt-4 w-full py-2 bg-retourgo-orange text-white rounded-md hover:bg-retourgo-orange/90"
              onClick={() => alert('Fonctionnalité en développement')}
            >
              {selectedItem.itemType === 'freight' ? 'Contacter l\'expéditeur' : 'Contacter le transporteur'}
            </button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MapSection;
