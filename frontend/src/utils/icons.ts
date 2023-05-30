import { Item } from "../types/icon";

export const sortIcons = (icons: Item[]): Item[] => {
  let itemsCopy = [...icons];
  itemsCopy.sort((a, b) => {
    return a.name.toLocaleUpperCase().localeCompare(b.name.toLocaleUpperCase());
  });
  return [...itemsCopy];
};

export const convertIconNameToClassName = (name?: string) => {
  return name ? `icon-if-${name}` : "";
};

export const isIconName = (value: string) => {
  const pattern = /[a-zA-Z0-9]+/g;
  const characters = value.length;
  return pattern.test(value) && characters >= 3 && characters <= 50;
};
