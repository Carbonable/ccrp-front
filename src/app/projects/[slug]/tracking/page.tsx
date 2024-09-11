'use client';

import { getDmrvData } from '@/actions/dmrv/dmrv';
import { Coordinates, Dmrv, Ndvi, Rgb } from '@/types/dmrv';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Title from '@/components/common/Title';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { ValueProps } from '@/types/select';
import { MapButton } from '@/components/common/Button';
import MapSelect from '@/components/tracking/MapSelect';
import TrackingSlider from '@/components/tracking/TrackingSlider';
import TrackingModal from '@/components/tracking/TrackingModal';
import moment from 'moment';

export enum TrackingIndicator {
  NDVI = 'ndvi',
  RGB = 'rgb',
}

export default function TrackingPage({ params }: Readonly<{ params: { slug: string } }>) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';
  const [dmrvData, setDmrvData] = useState<Dmrv | null>(null);

  useEffect(() => {
    const fetchDmrvData = async () => {
      try {
        const data = await getDmrvData(params.slug);
        setDmrvData(data);
      } catch (error) {
        console.error('Error fetching DMRV data:', error);
      }
    };

    fetchDmrvData();
  }, [params.slug]);

  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [bounds, setBounds] = useState<number[] | undefined | any>(undefined);
  const [coordinates, setCoordinates] = useState<Coordinates | undefined | any>(undefined);
  const [ndvis, setNdvis] = useState<Ndvi[] | undefined>(undefined);
  const [rgbs, setRgbs] = useState<Rgb[] | undefined>(undefined);
  const [selectedIndicator, setSelectedIndicator] = useState<ValueProps | undefined>(undefined);
  const [selectIndicators, setSelectIndicators] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dmrvData === null || dmrvData?.hasOwnProperty('indicators') === false) return;

    const selectData = [];

    for (const indicator of dmrvData.indicators) {
      selectData.push({
        id: indicator,
        name: indicator,
      });
    }
    setSelectIndicators(selectData);
    setSelectedIndicator(selectData[0]);
  }, [dmrvData]);

  useEffect(() => {
    if (dmrvData === undefined || dmrvData === null || dmrvData?.hasOwnProperty('ndvis') === false)
      return;

    setBounds(dmrvData.bounds);
    setCoordinates(dmrvData.coordinates[0]);
    setNdvis(dmrvData.ndvis);
    setRgbs(dmrvData.rgbs);
    setSelectedDateIndex(dmrvData.ndvis.length - 1);
    setSelectedImageIndex(dmrvData.ndvis.length - 1);
  }, [dmrvData]);

  useEffect(() => {
    if (
      selectedIndicator === undefined ||
      ndvis === undefined ||
      rgbs === undefined ||
      selectedImageIndex === undefined
    )
      return;

    const source = map.current?.getSource('data-viz') as mapboxgl.ImageSource;
    if (source === undefined) return;

    switch (selectedIndicator.id) {
      case TrackingIndicator.NDVI:
        source.updateImage({ url: ndvis[selectedImageIndex].image });
        break;
      case TrackingIndicator.RGB:
        source.updateImage({ url: rgbs[selectedImageIndex].url });
        break;
      default:
        break;
    }
  }, [selectedIndicator, selectedImageIndex, ndvis, rgbs]);

  useEffect(() => {
    if (
      map.current ||
      bounds === undefined ||
      coordinates === undefined ||
      ndvis === undefined ||
      selectedImageIndex === undefined
    )
      return; // initialize map only once

    // Init the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [bounds[0][1], bounds[1][0]],
    });

    // Resize the container of the map to fit the parent
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 50);

    setTimeout(() => {
      setMapLoaded(true);
    }, 5000);

    map.current.on('load', () => {
      if (map.current === null) return;

      map.current.fitBounds(
        [
          [bounds[0][1], bounds[0][0]], // southwestern corner of the bounds
          [bounds[1][1], bounds[1][0]], // northeastern corner of the bounds
        ],
        { padding: { top: 20, bottom: 90, left: 0, right: 0 } },
      );

      // Add a data source to display the delimited project area
      map.current.addSource('delimitation', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
              },
            },
          ],
        },
      });

      map.current.addLayer({
        id: 'outline',
        type: 'line',
        source: 'delimitation',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 6,
        },
      });

      const longitudes = coordinates.map((point: number[]) => point[0]);
      const latitudes = coordinates.map((point: number[]) => point[1]);
      const maxLon = Math.max(...longitudes);
      const minLon = Math.min(...longitudes);
      const maxLat = Math.max(...latitudes);
      const minLat = Math.min(...latitudes);

      // Add a source for the data viz
      map.current.addSource('data-viz', {
        type: 'image',
        url: ndvis[selectedImageIndex].image,
        coordinates: [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
        ],
      });

      map.current.addLayer({
        id: 'layer-layer',
        type: 'raster',
        source: 'data-viz',
        layout: { visibility: 'visible' },
        paint: {
          'raster-fade-duration': 0,
        },
      });
    });
  }, [bounds, coordinates, ndvis, selectedImageIndex, map]);

  if (mapLoaded === false) {
    return (
      <>
        <Title title="Tracking" isBeta={true} />
        <div className="relative">Loading data...</div>
      </>
    );
  }

  if (dmrvData === null || selectedDateIndex === undefined || ndvis === undefined) {
    return (
      <>
        <Title title="Tracking" isBeta={true} />
        <div className="relative">No tracking available for this project.</div>
      </>
    );
  }

  return (
    <>
      <Title title="Tracking" isBeta={true} />
      <div className="relative w-full">
        <div className="overflow-auto whitespace-break-spaces text-neutral-100">
          <div className="mt-2">
            We&apos;re excited to release the Beta version of our digital Monitoring feature.
            Utilizing satellite imagery and artificial intelligence, this innovative tool offers
            real-time data and sophisticated analysis on the performance and evolution of carbon
            removal projects. Through the implementation of this feature (dMRV), our aim is to
            enhance the integrity and accountability of carbon removal initiatives. Our
            collaboration with independent third-party providers ensures precision and transparency,
            maintaining an unbiased approach.
          </div>
          <div className="mt-2">
            Please note, as a Beta feature, digital Monitoring is a work in progress. It represents
            our commitment to constant improvement and evolution, as we refine this solution to
            optimally serve our clients and the environment. Our objective is to deliver
            comprehensive tracking and reporting on the carbon sequestration and biodiversity
            protection across all Carbonable projects.
          </div>
          <div className="mt-2">
            In interpreting the data, it&apos;s important to consider the effects of seasonal
            changes on vegetation and leaf growth. Year-on-year comparisons typically provide a more
            accurate view of carbon removal dynamics than month-to-month comparisons. Given that
            weather conditions can significantly vary from year to year, examining broader trends,
            rather than strict comparisons, is key to a robust understanding of these dynamics.
          </div>
          <div className="mt-2">
            Also, when it comes to monitoring Blue Carbon Projects - initiatives that focus on
            carbon sequestration in coastal ecosystems such as mangroves, salt marshes, and seagrass
            meadows - current metrics might not be as directly applicable due to their tidal nature.
            Vegetation and water levels can fluctuate dramatically throughout the day affecting
            considerably the indicator readings.{' '}
          </div>
        </div>

        <div ref={mapContainer} className="relative mt-8 h-[33vh] w-full">
          <div className="absolute left-4 top-4 z-10 w-fit">
            {selectedIndicator !== undefined && (
              <MapSelect
                values={selectIndicators}
                selectedValue={selectedIndicator}
                setSelectedValue={setSelectedIndicator}
              />
            )}
          </div>
          <div className="absolute right-4 top-4 z-10 w-fit">
            {selectedIndicator !== undefined && (
              <MapButton
                className="flex flex-nowrap items-center justify-center"
                onClick={() => setIsOpen(true)}
              >
                Learn More <QuestionMarkCircleIcon className="ml-2 w-5" />
              </MapButton>
            )}
          </div>
          {mapLoaded && (
            <div className="absolute bottom-0 left-0 z-10 w-full">
              <TrackingSlider
                data={dmrvData.ndvis}
                setSelectedImageIndex={setSelectedImageIndex}
                selectedDateIndex={selectedDateIndex}
                setSelectedDateIndex={setSelectedDateIndex}
              />
            </div>
          )}
        </div>
        {mapLoaded && (
          <div className="absolute bottom-[-12px] z-50 w-full">
            <div className="mx-auto flex h-[24px] w-[24px] items-center justify-center rounded-full bg-opacityLight-80">
              <ChevronLeftIcon className="w-[20px] text-neutral-900" />
              <ChevronRightIcon className="w-[20px] text-neutral-900" />
            </div>
          </div>
        )}
      </div>
      {mapLoaded && (
        <div className="mx-auto mt-6 w-fit rounded-xl border border-neutral-300 bg-opacityLight-10 py-2 pl-3 pr-2 text-sm">
          {moment(ndvis[selectedDateIndex].date).format('MMM. Do YYYY')}{' '}
          <span className="ml-2 rounded-lg border border-neutral-300 bg-opacityLight-10 px-2 py-1 text-xs">
            🌳 {Math.round(ndvis[selectedDateIndex].value * 100)}%
          </span>
        </div>
      )}
      <TrackingModal isOpen={isOpen} setIsOpen={setIsOpen} indicator={selectedIndicator} />
    </>
  );
}
