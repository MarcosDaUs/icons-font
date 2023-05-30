export type Item = {
  name: string;
  isTarget: boolean;
  path: string;
  icon: string;
  isFolder: boolean;
  items: Item[];
};
