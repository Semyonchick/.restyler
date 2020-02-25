import axios from 'axios';

export function fileUpload (blobFile, fileName) {
  let data = new FormData();
  data.append('uploadFile', blobFile, fileName);
  return axios.post('/api/v1/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data.result[0]);
}

export async function registerFile (group, blobFile, fileName, description) {
  let date = new Date().toJSON().slice(0, 19).split('T');
  date[0] = date[0].split('-').reverse().join('.');

  return axios.put('/api/v1/hl/files', {
    UF_GROUP: group,
    UF_NAME: fileName,
    UF_DESCRIPTION: description,
    UF_FILE: await fileUpload(blobFile, fileName),
    UF_CREATED_AT: date.join(' ')
  }).then(res => res.data.result);
}