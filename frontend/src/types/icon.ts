export type Item = {
  name: string;
  isTarget: boolean;
  path: string;
  icon: string;
  isFolder: boolean;
  items: Item[];
};

export type GetIconsResponse = {
  data: Item[];
};

export type UpdateIconRequest = {
  name: string;
  oldPath: string;
  file?: File;
};

export type UpdateIconResponse = {
  data: Item;
};

export type CreateIconRequest = {
  name: string;
  file: File;
  folderPath: string;
};

export type CreateIconResponse = {
  data: Item;
};

export type DeleteIconRequest = {
  path: string;
};

export type DeleteIconResponse = {
  data: Item;
};

export type CheckIconRequest = {
  icon: string;
};

export type CheckIconResponse = {
  data: boolean;
};
