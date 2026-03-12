"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const INITIAL_VIEW = {
  longitude: 14.5,
  latitude: 65.5,
  zoom: 4,
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

export function KystMap({ kommuner = [], height = "500px", className = "" }: KystMapProps) {
  const [popup, setPopup] = useState<KommunePunkt | null>(null);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height }}>
      <Map
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {kommuner.map((k) => (
          <Marker
            key={k.id}
            longitude={k.lng}
            latitude={k.lat}
            anchor="center"
            onClick={() => setPopup(k)}
          >
            <div
              className="cursor-pointer rounded-full bg-hav-600 ring-2 ring-white transition hover:bg-hav-400"
              style={{
                width: Math.max(12, Math.min(36, 10 + k.antallProsjekter * 6)),
                height: Math.max(12, Math.min(36, 10 + k.antallProsjekter * 6)),
                opacity: 0.85,
              }}
            />
          </Marker>
        ))}

        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            closeButton
            className="rounded-lg"
          >
            <div className="px-1 py-0.5">
              <p className="font-semibold text-slate-900">{popup.navn}</p>
              <p className="text-sm text-slate-500">{popup.fylke}</p>
              <p className="text-sm text-hav-700">
                {popup.antallProsjekter} prosjekt{popup.antallProsjekter !== 1 ? "er" : ""}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
