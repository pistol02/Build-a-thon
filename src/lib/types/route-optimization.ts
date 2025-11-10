import { LatLngTuple } from "leaflet";
import { Dispatch, SetStateAction } from "react";


export enum Education {
  MasterDegree = "Master Degree",
  Graduation = "Graduated",
  InGraduation = "In Graduation",
  twelvethPass = "12th Pass",
}

export interface WeatherData {
  weather: string;
  chances: number;
}
export interface RouteOptimizationCard {
  title: string;
  age: string;
  

  weatherData: WeatherData[];
  journey: {
    from: string;
    via?: string[];
    to: string;
    progress: number;
    route: LatLngTuple[];
    viaRoute?: LatLngTuple[];
  };
  vehicle: {
    company: string;
    model: string;
    space: number;
    volume: number;
    weight: number;
  };
  order: {
    title: string;
    quantity: number;
    weight: number;
    volume: number;
    payment: string;
  };
  history: {
    id: string;
    status: string;
    method: string;
    amount: number;
  }[];
  checkpoints: {
    title: string;
    progress: number;
    date: string;
  }[];
  price: number;
}

export interface RouteOptimizationSidebarProps {
  data: RouteOptimizationCard[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}

export interface RouteOptimizationMapProps {
  data: RouteOptimizationCard[];
  active: number;
}

export interface RouteOptimizationCardProps extends RouteOptimizationCard {
  handleClick: () => void;
  isActive: boolean;
}

export interface MapProps {
  card: RouteOptimizationCard;
}

export enum ShipmentStatus {
  "READY" = "ready",
  "PENDING" = "pending",
}

export enum RouteType {
  "FASTEST" = "Fastest",
  "CHEAPEST" = "Cost Efficient",
  "GREENEST" = "Eco Friendly",
}

export enum ModeType {
  "ROADWAY" = "Roadway",
  "AIRWAY" = "Airway",
  "RAIL_ROAD" = "Rail and Roadway",
}

export interface Place { 
  name: string;
  location: LatLngTuple;
  airports?: LatLngTuple;
  railwayStations?: LatLngTuple;
}

export interface ShipmentRecord {
  id: string;
  name: string;
  status: ShipmentStatus;
  from: Place;
  to: Place;
  via?: Place;
  availableVia?: Place[];
  assignedTruck?: string
  routeType?: RouteType
  mode?: ModeType
}