import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

//This function converts an uploaded file into a base64 Data URI string so it can be uploaded to cloud storage.
const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString(); 
  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
