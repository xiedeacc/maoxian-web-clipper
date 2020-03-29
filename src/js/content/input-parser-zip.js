"use strict";

import T from '../lib/tool.js';
import sanitize from 'sanitize-filename';

//==========================================
// Input Parser for Zip
//==========================================

const InputParser_Zip = {
  parse: params => {
    let { format, title, category, tags, domain, link, config } = params;

    // Set default title
    title = title === "" ? 'Untitled' : title;
  
    // Add domain as tag
    const appendTags = []
    if (config.saveDomainAsTag) {
      appendTags.push(domain);
    }
  
    // Set default category
    if (category === '') {
      category = (config.defaultCategory === '' ? 'default' : config.defaultCategory);
    }
  
    // Set main filename, "index" is used to identify the entry point of document
    const mainFilename = ['index', format].join('.');
  
    // clipId
    const now = T.currentTime();
    const clipId = now.str.intSec;
  
    // Keep all paths relative to $WIZNOTE_TEMP/webclipping
    const sanitized_title = sanitize(title);
    const storageInfo = {
      /** the path to place index.html and assetFolder */
      mainFileFolder: sanitized_title,
      mainFileName: mainFilename,
      /** the path to place frame files */
      frameFileFolder: sanitized_title + "/index_files",
      /** the path to place asset files */
      assetFolder: sanitized_title + "/index_files",
      /** the path is relative to index.html */
      assetRelativePath: "index_files"
    };
  
    const info = {
      clipId: clipId,
      format: format,
      title: title,
      link: link,
      category: category,
      tags: tags.concat(appendTags),
      created_at: now.toString(),
    }
  
    const inputHistory = { title: title, category: category, tags: tags }
  
    const result = {
      info: info,
      storageInfo: storageInfo,
      input: inputHistory,
      needSaveIndexFile: false,
      needSaveTitleFile: false
    }
  
    return result;
  }
};

export default InputParser_Zip;
