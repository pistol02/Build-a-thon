export type LatLng = {
    lat: number;
    lng: number;
};

export type Bounds = {
    northeast: LatLng;
    southwest: LatLng;
};

export type Distance = {
    text: string;
    value: number;
};

export type Duration = {
    text: string;
    value: number;
};

export type Step = {
    distance: Distance;
    duration: Duration;
    end_location: LatLng;
    html_instructions: string;
    polyline: {
        points: string;
    };
    start_location: LatLng;
    travel_mode: string;
    maneuver?: string; // Optional, as it may not exist in all steps
};

export type Leg = {
    distance: Distance;
    duration: Duration;
    end_address: string;
    end_location: LatLng;
    start_address: string;
    start_location: LatLng;
    steps: Step[];
};

export type Route = {
    bounds: Bounds;
    copyrights: string;
    legs: Leg[];
    overview_polyline?: {
        points: string;
    };
    summary?: string;
    warnings?: string[];
    waypoint_order?: number[];
};

export type GoogleDirectionsResponse = {
    geocoded_waypoints: {
        geocoder_status: string;
        place_id: string;
        types: string[];
    }[];
    routes: Route[];
    status: string;
};
