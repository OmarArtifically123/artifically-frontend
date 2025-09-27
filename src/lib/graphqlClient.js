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
    id: "marketplace",
    icon: "🛒",
    title: "Marketplace, Not a Builder",
    description:
      "Choose from battle-tested automations built by experts. No complex flow building or configuration nightmares.",
    status: "Available now",
  },
  {
    id: "integrations",
    icon: "🔗",
    title: "Enterprise Integrations",
    description:
      "Seamlessly connects with Stripe, HubSpot, Shopify, Slack, WhatsApp, and 50+ business tools out of the box.",
    status: "Integrations expanding",
  },
  {
    id: "security",
    icon: "🛡️",
    title: "Military-Grade Security",
    description:
      "SOC 2 compliant with zero-trust architecture, end-to-end encryption, and granular permission controls.",
    status: "SOC 2 Type II",
  },
  {
    id: "deployment",
    icon: "⚡",
    title: "Lightning Deployment",
    description:
      "From selection to production in under 10 minutes. No coding, no complex setup, just results.",
    status: "<10 min rollout",
  },
  {
    id: "analytics",
    icon: "📊",
    title: "Real-Time Analytics",
    description:
      "Monitor performance, track ROI, and optimize operations with comprehensive dashboards and insights.",
    status: "Live dashboards",
  },
  {
    id: "scale",
    icon: "🚀",
    title: "Infinite Scale",
    description:
      "Built on cloud-native infrastructure that scales from startup to enterprise without breaking stride.",
    status: "Multi-region",
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

export const apolloClient = new ApolloClient({
  link: schemaLink,
  cache,
  ssrMode: typeof window === "undefined",
});

export default apolloClient;