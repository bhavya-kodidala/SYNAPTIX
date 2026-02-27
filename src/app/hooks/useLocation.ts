import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useLocation = () => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
            );
            const data = await response.json();

            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Unknown City';
            const state = data.address.state || 'Unknown State';
            const country = data.address.country || 'Unknown Country';

            return `${city}, ${state}, ${country}`;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return 'Location detected (Address unavailable)';
        }
    };

    const detectLocation = useCallback(async (silent = false) => {
        if (!navigator.geolocation) {
            if (!silent) toast.error('Geolocation is not supported by your browser');
            return null;
        }

        setIsDetecting(true);
        return new Promise<{ lat: number; lng: number; address: string } | null>((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const address = await reverseGeocode(latitude, longitude);
                    setIsDetecting(false);
                    setPermissionStatus('granted');
                    resolve({ lat: latitude, lng: longitude, address });
                },
                (error) => {
                    setIsDetecting(false);
                    let errorMsg = 'Failed to detect location';
                    if (error.code === 1) {
                        errorMsg = 'Location permission denied';
                        setPermissionStatus('denied');
                    }
                    else if (error.code === 2) errorMsg = 'Location unavailable';
                    else if (error.code === 3) errorMsg = 'Location request timed out';

                    if (!silent) toast.error(errorMsg);
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }, []);

    const watchLocation = useCallback((onUpdate: (coords: { lat: number, lng: number }) => void) => {
        if (!navigator.geolocation) return null;

        return navigator.geolocation.watchPosition(
            (position) => {
                onUpdate({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setPermissionStatus('granted');
            },
            (error) => {
                if (error.code === 1) setPermissionStatus('denied');
            },
            { enableHighAccuracy: true } // Removed invalid distanceFilter
        );
    }, []);

    return { detectLocation, watchLocation, isDetecting, permissionStatus };
};
