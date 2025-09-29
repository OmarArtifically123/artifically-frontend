import { ApolloClient, InMemoryCache, ApolloLink, gql } from "@apollo/client";
import { Observable } from "@apollo/client/core";
import { graphql, buildSchema } from "graphql";
import { print } from "graphql/language/printer";

const schema = buildSchema(`
  type Feature {
    id: ID!
    icon: String!
    title: String!
    description: String!
    status: String!
  }

  type MarketplaceStats {
    totalAutomations: Int!
    averageROI: Float!
    partners: Int!
  }

  type Query {
    featureHighlights: [Feature!]!
    marketplaceStats: MarketplaceStats!
  }
`);

const featureHighlights = [
  {
    id: "live-demos",
    icon: "⚡",
    title: "One-click live demos",
    description: "See automation running with your actual data (simulated)",
    status: "Immersive preview",
  },
  {
    id: "roi-calculator",
    icon: "📈",
    title: "Interactive ROI calculator",
    description: "Drag sliders to see cost/benefit in real-time",
    status: "Dynamic projections",
  },
  {
    id: "workflow-visualization",
    icon: "🧠",
    title: "3D workflow visualization",
    description: "See exactly how data flows through each step",
    status: "Spatial insight",
  },
  {
    id: "before-after",
    icon: "🔄",
    title: "Before/after scenarios",
    description: "Visual comparison of manual vs automated process",
    status: "Clarity mode",
  },
  {
    id: "demo-metrics",
    icon: "📊",
    title: "Realistic projections",
    description: "Every demo surfaces live-looking KPIs tailored to your inputs",
    status: "Insightful",
  },
  {
    id: "safe-interaction",
    icon: "🛡️",
    title: "Safe sandbox interaction",
    description: "Experiment confidently with isolated, no-risk data streams",
    status: "Sandboxed",
  },
];

const automationSample = [
  { id: "auto-1", partner: "Artifically Labs", roi: 4.8 },
  { id: "auto-2", partner: "Quantum Ops", roi: 5.4 },
  { id: "auto-3", partner: "Artifically Labs", roi: 4.5 },
  { id: "auto-4", partner: "Global CX", roi: 5.1 },
];

const marketplaceStats = () => {
  const totalAutomations = automationSample.length;
  const partners = new Set(automationSample.map((item) => item.partner)).size;
  const averageROI =
    automationSample.reduce((acc, item) => acc + (item.roi || 4.2), 0) /
    Math.max(totalAutomations || 1, 1);

  return {
    totalAutomations,
    partners,
    averageROI: Number(averageROI.toFixed(2)),
  };
};

const resolvers = {
  featureHighlights: () => featureHighlights,
  marketplaceStats,
};

export const FALLBACK_FEATURE_HIGHLIGHTS = featureHighlights;
export const FALLBACK_MARKETPLACE_STATS = marketplaceStats();

const schemaLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    graphql({
      schema,
      source: print(operation.query),
      rootValue: resolvers,
      variableValues: operation.variables,
    })
      .then((result) => {
        observer.next(result);
        observer.complete();
      })
      .catch((error) => observer.error(error));
  });
});

export const FEATURE_HIGHLIGHTS_QUERY = gql`
  query FeatureHighlights {
    featureHighlights {
      id
      icon
      title
      description
      status
    }
    marketplaceStats {
      totalAutomations
      averageROI
      partners
    }
  }
`;

export const MARKETPLACE_STATS_QUERY = gql`
  query MarketplaceStatsOnly {
    marketplaceStats {
      averageROI
    }
  }
`;

const createCache = (initialState) => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          featureHighlights: {
            merge(_, incoming) {
              return incoming;
            },
          },
          marketplaceStats: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });

  if (initialState) {
    cache.restore(initialState);
  }

  return cache;
};

export const createApolloClient = (initialState) =>
  new ApolloClient({
    link: schemaLink,
    cache: createCache(initialState),
    ssrMode: typeof window === "undefined",
  });

export const apolloClient = createApolloClient(
  typeof window !== "undefined" ? window.__APOLLO_STATE__ : undefined
);

export default apolloClient;