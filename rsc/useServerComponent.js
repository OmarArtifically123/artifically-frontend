const cache = new Map();

const createResource = (url) => {
  let status = "pending";
  let result;

  const suspender = fetch(url, {
    headers: {
      Accept: "text/html",
      "X-Server-Component": "1",
    },
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load server component: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      status = "success";
      result = html;
    })
    .catch((error) => {
      status = "error";
      result = error;
    });

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      }
      if (status === "error") {
        throw result;
      }
      return result;
    },
  };
};

export const preloadServerComponent = (key, url = key) => {
  if (!cache.has(key)) {
    cache.set(key, createResource(url));
  }
  return cache.get(key);
};

export default function useServerComponent(key, url = key) {
  return preloadServerComponent(key, url).read();
}