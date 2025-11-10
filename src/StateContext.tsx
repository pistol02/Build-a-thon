import { createContext, Dispatch, SetStateAction } from 'react';

// Assuming your state value is of type 'any' for simplicity, replace it with your actual type.
type StateValueType = any;

const StateContext = createContext<StateValueType | undefined>(undefined);

export default StateContext;