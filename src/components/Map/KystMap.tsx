"use client";

import { useRef, useState, useCallback } from "react";
import Map, { NavigationControl, ScaleControl, Source, Layer } from "react-map-gl/maplibre";
import type { MapRef, MapMouseEvent } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import {
  ScatterplotLayer,
  GeoJsonLayer,
} from "@deck.gl/layers";
import type { PickingInfo } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";

const INITIAL_VIEW_STATE = {
  longitude: 14.5,
  latitude: 65.5,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

export interface KommunePunkt {
  id: number;
  navn: string;
  fylke: string;
  lat: number;
  lng: number;
  antallProsjekter: number;
}

interface KystMapProps {
  kommuner?: KommunePunkt[];
  height?: string;
  className?: string;
}

interface TooltipInfo {
  x: number;
  y: number;
  object: KommunePunkt | null;
}

export function KystMap({ kommuner = [], height = "500px", className = "" }: KystMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const layers = [
    new ScatterplotLayer<KommunePunkt>({
      id: "kommuner-layer",
      data: kommuner,
      getPosition: (d) => [d.lng, d.lat],
      getRadius: (d) => Math.max(5000, d.antallProsjekter * 8000),
      getFillColor: (d) =>
        d.antallProsjekter > 3 ? [0, 102, 179, 200] : [0, 164, 189, 180],
      getLineColor: [255, 255, 255, 200],
      lineWidthMinPixels: 1,
      pickable: true,
      radiusMinPixels: 6,
      radiusMaxPixels: 40,
      onHover: (info: PickingInfo) => {
        if (info.object) {
          setTooltip({ x: info.x, y: info.y, object: info.object as KommunePunkt });
        } else {
          setTooltip(null);
        }
      },
    }),
  ];

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={layers}
      >
        <Map
          ref={mapRef}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          attributionControl={false}
        >
          <NavigationControl position="top-right" />
          <ScaleControl position="bottom-right" />
        </Map>
      </DeckGL>

      {tooltip?.object && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <p className="font-semibold text-slate-900">{tooltip.object.navn}</p>
          <p className="text-sm text-slate-500">{tooltip.object.fylke}</p>
          <p className="text-sm text-hav-700">
            {tooltip.object.antallProsjekter} prosjekt
            {tooltip.object.antallProsjekter !== 1 ? "er" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
