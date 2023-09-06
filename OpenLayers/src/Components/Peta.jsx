import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import DragBox from 'ol/interaction/DragBox';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import kotaBandung from '../assets/3273-kota-bandung.json'
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
const UserManagement = React.lazy(() => import("UserManagement/UserManagement"))

function Peta() {
    const mapRef = useRef();
    const [map, setMap] = useState(null);
    const [source] = useState(new VectorSource());
    const [isZooming, setIsZooming] = useState(false);
    const [draw, setDraw] = useState(null);

    const [openUser, setOpenUserManagement] = useState(false)
    const ShowPUser = () => {
        if (openUser) {
            setOpenUserManagement(false);
        } else {
            setOpenUserManagement(true);
        }
    }

    useEffect(() => {
        const olMap = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorLayer({
                    source: source
                }),
            ],
            view: new View({
                center: fromLonLat([118.8186111, -1.15]),
                zoom: 5.34,
            }),
        });

        setMap(olMap);
        const bandungStyle = new Style({
            fill: new Fill({
                color: 'rgba(0,0,255,0.5)'
            }),
            stroke: new Stroke({
                color: 'blue',
                width: 2
            })
        });

        const bandungLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(kotaBandung, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }),
            }),
            style: bandungStyle,
        });

        const storedPolyline = localStorage.getItem('drawPolyline');
        if (storedPolyline) {
            const coords = JSON.parse(storedPolyline);
            const feature = new Feature({
                geometry: new LineString(coords)
            });
            source.addFeature(feature);
        }

        olMap.addLayer(bandungLayer);

        return () => olMap.setTarget(undefined);
    }, [source]);

    const startZoomArea = () => {
        setIsZooming(!isZooming);
        if (!isZooming) {
            const dragBox = new DragBox();
            map.addInteraction(dragBox);
            dragBox.on('boxend', () => {
                const extent = dragBox.getGeometry().getExtent();
                map.getView().fit(extent, {
                    size: map.getSize(),
                    duration: 250,
                    Zoom: 7.5,
                });
                setIsZooming(false);
                map.removeInteraction(dragBox);
            });
        } else {
            map.removeInteraction(
                map
                    .getInteractions()
                    .getArray()
                    .find((Interaction) => Interaction instanceof DragBox)
            );
        }
    }

    const startDrawing = (type) => {
        if (draw) {
            map.removeInteraction(draw);
        }
        const newDraw = new Draw({
            source: source,
            type: type,
        });
        newDraw.on('drawend', (event) => {
            const coords = event.feature.getGeometry().getCoordinates();
            localStorage.setItem('', JSON.stringify(coords));
        });
        map.addInteraction(newDraw);
        setDraw(newDraw);
    }

    const stopDrawing = () => {
        if (draw) {
            map.removeInteraction(draw);
            setDraw(null);
        }
    }

    const undoDrawing = () => {
        const features = source.getFeatures();
        if (features.length > 0) {
            source.removeFeature(features[features.length - 1]);
        }
    }

    return (
        <div className='w-full h-full'>
            {!openUser ? (
                <div className='w-full h-full'>
                    <div ref={mapRef} className='absolute top-0 left-0 right-0 bottom-0'>
                    </div>
                    <div className='absolute left-0 bottom-0 mb-5 ml-5 space-y-2 w-1/6'>

                        <button className="bg-green-500 text-white mr-1 p-2 rounded w-full" onClick={ShowPUser}>Go Back</button>


                    </div>
                    <div className="absolute right-0 top-0 mb-5 mr-5 space-y-2">
                        <button onClick={() => startDrawing("LineString")} className="bg-blue-500 text-white mr-1 p-2 rounded">Line String</button>
                        <button onClick={() => startDrawing("Polygon")} className="bg-blue-500 text-white mr-1 p-2 rounded">Polygon</button>
                        <button onClick={() => startDrawing("Circle")} className="bg-blue-500 text-white mr-1 p-2 rounded">Circle</button>
                        <button onClick={stopDrawing} className="bg-red-500 text-white mr-1 p-2 rounded">Undraw</button>
                        <button onClick={undoDrawing} className="bg-gray-500 text-white mr-1 p-2 rounded">Undo Draw</button>
                        <button onClick={startZoomArea} className="bg-green-500 text-white mr-1 p-2 rounded">Zoom Area</button>
                    </div>
                </div>
            ) : (
                <React.Suspense fallback={"Loading"} >
                    <UserManagement />
                </React.Suspense >
            )

            }
        </div>
    )
}

export default Peta;