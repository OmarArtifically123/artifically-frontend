import tokensJson from './tokens.json';

type TokenPrimitive = string | number | boolean | null;
type TokenValue = TokenPrimitive | TokenRecord;
interface TokenRecord {
  [key: string]: TokenValue;
}

type AliasMap = Record<string, string>;

type FlattenedTokens = Record<string, string>;

type DesignTokenOptions = {
  target?: HTMLElement;
};

type ApplyResult = {
  applied: FlattenedTokens;
  aliases: Record<string, string>;
};

const ALIASES_KEY = 'aliases';

const isTokenRecord = (value: TokenValue): value is TokenRecord =>
  typeof value === 'object' && value !== null;

const flattenTokens = (record: TokenRecord, prefix = ''): FlattenedTokens => {
  return Object.entries(record).reduce<FlattenedTokens>((acc, [key, value]) => {
    if (key === ALIASES_KEY) {
      return acc;
    }

    const path = prefix ? `${prefix}.${key}` : key;
    if (isTokenRecord(value)) {
      Object.assign(acc, flattenTokens(value, path));
      return acc;
    }

    acc[path] = String(value);
    return acc;
  }, {});
};

const normaliseAliasMap = (record: TokenRecord): AliasMap => {
  const aliases = record[ALIASES_KEY];
  if (!aliases || typeof aliases !== 'object') {
    return {};
  }

  return Object.entries(aliases as Record<string, TokenValue>).reduce<AliasMap>(
    (acc, [alias, path]) => {
      if (typeof path === 'string') {
        acc[alias] = path;
      }
      return acc;
    },
    {},
  );
};

const flattenedTokens = flattenTokens(tokensJson as TokenRecord);
const aliasMap = normaliseAliasMap(tokensJson as TokenRecord);

const resolveTokenPath = (path: string): string | undefined => flattenedTokens[path];

const toCssVar = (path: string) => `--${path.replace(/\./g, '-')}`;

export const applyDesignTokens = ({ target }: DesignTokenOptions = {}): ApplyResult | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const element = target ?? document.documentElement;

  Object.entries(flattenedTokens).forEach(([path, value]) => {
    element.style.setProperty(toCssVar(path), value);
  });

  const appliedAliases: Record<string, string> = {};

  Object.entries(aliasMap).forEach(([alias, path]) => {
    const value = resolveTokenPath(path);
    if (value) {
      element.style.setProperty(alias, value);
      appliedAliases[alias] = value;
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn(`Unknown design token path for alias "${alias}": ${path}`);
    }
  });

  return { applied: { ...flattenedTokens }, aliases: appliedAliases };
};

export const getDesignToken = (path: string): string | undefined => resolveTokenPath(path);

export type { FlattenedTokens };