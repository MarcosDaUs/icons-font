import { Item } from '../types/icons.types';

export const isFolderPath = (value: string) => {
  const pattern = /^([a-zA-Z0-9]+\/)+$/g;
  return pattern.test(value);
};

export const isIconPath = (value: string) => {
  const pattern = /^([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+[.][s][v][g]$/g;
  return pattern.test(value);
};

export const isFolderOrIconPath = (value: string) => {
  return isFolderPath(value) || isIconPath(value);
};

export const isRelativeFolderPath = (value: string) => {
  const pattern = /^([a-zA-Z0-9]+\/)$/g;
  return pattern.test(value);
};

export const isRelativeIconPath = (value: string) => {
  const pattern = /^([a-zA-Z0-9]+\/)?[a-zA-Z0-9]+[.][s][v][g]$/g;
  return pattern.test(value);
};

export const isRelativeFolderOrIconPath = (value: string) => {
  return isRelativeFolderPath(value) || isRelativeIconPath(value);
};

export const getObjectNameOfPath = (path: string) => {
  const isFolder = isFolderPath(path);
  const pathArray = path?.split('/');
  const lastIndex = (pathArray?.length || 0) - 1;
  return lastIndex >= 0 ? pathArray[isFolder ? lastIndex - 1 : lastIndex] : '';
};

export const getNewPath = (
  pathArray: string[],
  index: number,
  isFolder: boolean
) => {
  return `${pathArray?.slice(0, index + 1).join('/')}${isFolder ? '/' : ''}`;
};

export const removeIconNameExtension = (name: string) => {
  return name.replace('.svg', '');
};

const convertIconNameToClassName = (name: string) => {
  return name ? `icon-if-${name}` : '';
};

export const getIconObject = (
  name: string,
  path: string,
  isTarget = false
): Item => {
  return {
    name: name,
    path: path,
    isFolder: false,
    icon: convertIconNameToClassName(name),
    isTarget: isTarget,
    items: [],
  };
};

export const changeObjectNameInPath = (path: string, name: string) => {
  const isFolder = isFolderPath(path);
  const pathArray = path?.split('/');
  const lastIndex = (pathArray?.length || 0) - 1;
  if (lastIndex >= 0) {
    pathArray.pop();
    isFolder ? pathArray.pop() : undefined;
    pathArray.push(name);
  }
  return `${pathArray.join('/')}${isFolder ? '/' : ''}`;
};

export const removeObjectNameInPath = (path: string) => {
  const isFolder = isFolderPath(path);
  if (isFolder) return path;
  const pathArray = path?.split('/');
  const lastIndex = (pathArray?.length || 0) - 1;
  if (lastIndex >= 0) pathArray.pop();
  return `${pathArray.join('/')}`;
};
