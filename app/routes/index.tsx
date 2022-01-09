import Component, {
  meta as importedMeta,
  links as importedLinks,
  loader as importedLoader,
} from "~/routes/$slug";

export const meta = importedMeta;
export const links = importedLinks;
export const loader = importedLoader;
export default Component;
