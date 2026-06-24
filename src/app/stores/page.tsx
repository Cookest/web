"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, Tag, Navigation } from "lucide-react";
import { Card, CardBody, Badge, Button, Alert, Skeleton } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import type { NearbyStore } from "@/lib/types";

interface Coords {
  lat: number;
  lng: number;
}

function StoreCard({ store }: { store: NearbyStore }) {
  const distance =
    store.distance_km < 1
      ? `${Math.round(store.distance_km * 1000)} m`
      : `${store.distance_km.toFixed(1)} km`;

  return (
    <Card>
      <CardBody>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-heading truncate">{store.name}</p>
                {store.brand && (
                  <p className="text-xs text-muted">{store.brand}</p>
                )}
              </div>
              <span className="text-sm font-medium text-muted whitespace-nowrap">
                {distance}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {store.is_curated && (
                <Badge variant="success" size="sm">
                  <Star className="w-2.5 h-2.5" />
                  Curated
                </Badge>
              )}
              {store.has_promotions && (
                <Badge variant="warning" size="sm">
                  <Tag className="w-2.5 h-2.5" />
                  Promotions
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function StoresPage() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Location access denied. Enable it in browser settings.");
        setGeoLoading(false);
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const { data: stores, isLoading } = useQuery<NearbyStore[]>({
    queryKey: ["stores", coords],
    queryFn: () => api.getNearbyStores(coords!.lat, coords!.lng),
    enabled: !!coords,
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Stores" subtitle="Find grocery stores near you" />
        {!geoLoading && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 flex-shrink-0"
            onClick={detectLocation}
          >
            <Navigation className="w-4 h-4" />
            Refresh location
          </Button>
        )}
      </div>

      {geoError && (
        <Alert variant="error">
          <span>{geoError}</span>
        </Alert>
      )}

      {(geoLoading || isLoading) && !geoError && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardBody>
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {!geoLoading && !isLoading && stores && stores.length === 0 && (
        <div className="text-center py-16 text-muted">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No stores found nearby.</p>
        </div>
      )}

      {!geoLoading && !isLoading && stores && stores.length > 0 && (
        <div className="space-y-3">
          {stores.map((store) => (
            <StoreCard key={store.id ?? store.name} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}
