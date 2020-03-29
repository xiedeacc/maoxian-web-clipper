"use strict";

import SavingTool from './saving-tool.js';
import Fetcher from './fetcher.js';
import JSZip from 'jszip';
import ExtApi from '../lib/ext-api.js';
import FileSaver from 'file-saver';

function handleTask(task) {
  return new Promise((resolve, reject) => {
    switch(task.type){
      // html, markdown, styles
      case 'text':
        resolve({
          blob: new Blob([task.text], {
            type: task.mimeType
          }),
          filename: task.filename
        });
        SavingTool.taskCompleted(task.filename);
        break;
      case 'blob':
        resolve({
          blob: blob,
          filename: task.filename
        });
        SavingTool.taskCompleted(task.filename);
        break;
      // images and fonts
      case 'url' :
        Fetcher.get(task.url, {
          respType: 'blob',
          headers: task.headers,
          timeout: task.timeout,
        }).then(
          (blob) => {
            resolve({
              blob: blob,
              filename: task.filename
            });
            SavingTool.taskCompleted(task.filename);
          },
          (err) => {
            SavingTool.taskFailed(task.filename, err.message);
            reject(err);
          }
        );
        break;
      default:
        reject("Unknown task type.");
        SavingTool.taskFailed(task.filename, "Unknown task type.");
        break;
    }
  })
}

const ClippingHandler_Zip = {
  name: 'Browser',
  
  getInfo: callback => {
    callback({
      ready: true,
      supportFormats: ['html', 'md']
    });
  },

  saveClipping: async (clipping, feedback) => {
    SavingTool.startSaving(clipping, feedback, { mode: 'completeWhenAllTaskFinished' });
    const promises = clipping.tasks.map((task) => handleTask(task, clipping));
    const zip = new JSZip();
    const files = await Promise.all(promises);

    files.reduce((zipfile, fileObj) => {
      zipfile.file(fileObj.filename, fileObj.blob);
      return zipfile;
    }, zip);

    zip.generateAsync({type: "blob"}).then(zipblob => {
      FileSaver.saveAs(zipblob, clipping.info.title + ".zip");
    })
  },

  handleClippingResult: it => {
    //TODO: no results
    it.url = "";
    return it;
  }
}

export default ClippingHandler_Zip;