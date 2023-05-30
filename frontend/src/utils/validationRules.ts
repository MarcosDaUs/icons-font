export const checkSvgExtension = (fileName: string, fileType: string) => {
  return /\.(svg)$/gim.test(fileName) && fileType.indexOf("svg") > 0;
};
