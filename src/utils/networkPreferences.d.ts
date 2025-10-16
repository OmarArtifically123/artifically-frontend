export interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  onchange?: ((this: NetworkInformationLike, ev: Event) => void) | null;
  addEventListener?: (type: 'change', listener: (event: Event) => void) => void;
  removeEventListener?: (type: 'change', listener: (event: Event) => void) => void;
}

export function getNetworkInformation(): NetworkInformationLike | undefined;
export function prefersLowPower(connection?: NetworkInformationLike | undefined): boolean;

declare const networkPreferences: {
  getNetworkInformation: typeof getNetworkInformation;
  prefersLowPower: typeof prefersLowPower;
};

export default networkPreferences;