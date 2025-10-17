const CONNECTION_KEYS = ["connection", "mozConnection", "webkitConnection"];

export const getNetworkInformation = () => {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return CONNECTION_KEYS.reduce((found, key) => found || navigator[key], undefined);
};

export const prefersLowPower = (connection = getNetworkInformation()) => {
  if (!connection) return false;
  if (connection.saveData) return true;
  const effectiveType = connection.effectiveType || "";
  return /(2g|slow-2g)/i.test(effectiveType);
};

export default {
  getNetworkInformation,
  prefersLowPower,
};