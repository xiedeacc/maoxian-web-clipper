  "use strict";

  import T from '../lib/tool.js';

  const clipIdDict = T.createDict(); // taskFilename => clipId
  const clippingDict = T.createDict(); // clipId => clipping
  const feedbackFnDict = T.createDict(); // clipId => feedbackFn
  let mode = 'completeWhenAllTaskFinished'; // or completeWhenMainTaskFinished

  function startSaving(clipping, feedbackFn, options={}) {
    if(options.mode) {
      mode = options.mode;
    } else {
      throw new Error("'mode' must provided");
    }
    initClipIdDict(clipping);
    clippingDict.add(clipping.info.clipId, clipping);
    feedbackFnDict.add(clipping.info.clipId, feedbackFn);
    feedbackFn({ type: 'started', clipId: clipping.info.clipId});
  }

  function taskFailed(taskFilename, errMsg) {
    const clipId = clipIdDict.find(taskFilename);
    if(!clipId) {
      // If clipping handler invoke this function
      // without invoke startSaving function first,
      // It's OK, We do nothing.
      console.warn("<mx-wc>", "Couldn't find clipping with task filename: ", taskFilename);
      return;
    }
    const clipping = clippingDict.find(clipId);
    clipIdDict.remove(taskFilename);
    // if mode is 'completeWhenMainTaskFinished',
    // then clipping could be undefined
    if(clipping) {
      const currTask = setTaskAttrs(clipping, taskFilename, { state: 'failed', errMsg: errMsg });
      clippingDict.add(clipId, clipping);
      updateProgress(clipping, currTask);
    }
  }

  function taskCompleted(taskFilename, appendAttrs) {
    const clipId = clipIdDict.find(taskFilename);
    if(!clipId) {
      console.warn("<mx-wc>", "Couldn't find clipping with task filename: ", taskFilename);
      return;
    }
    const clipping = clippingDict.find(clipId);
    clipIdDict.remove(taskFilename);
    if(clipping){
      setTaskAttrs(clipping, taskFilename, { state: 'completed'});
      const currTask = setTaskAttrs(clipping, taskFilename, appendAttrs);
      clippingDict.add(clipId, clipping);
      updateProgress(clipping, currTask);
    }
  }

  function updateProgress(clipping, currTask) {
    const [finished, total] = calcProgress(clipping);
    const feedbackFn = feedbackFnDict.find(clipping.info.clipId);
    feedbackFn({type: 'progress', clipId: clipping.info.clipId, finished: finished, total: total});
    if(mode == 'completeWhenMainTaskFinished') {
      if(currTask.taskType === 'mainFileTask') {
        complete(clipping, feedbackFn);
      }
    } else {
      if(finished === total) {
        complete(clipping, feedbackFn);
      }
    }
  };

  function complete(clipping, feedbackFn) {
    const clippingResult = generateClippingResult(clipping);
    feedbackFn({
      type: 'completed',
      clippingResult: clippingResult
    });
    clippingDict.remove(clipping.info.clipId);
    feedbackFnDict.remove(clipping.info.clipId);
  }

  function generateClippingResult(clipping) {
    let mainTask = undefined;
    const completedTasks = [],
    failedTasks = [],
    pendingTasks = [];

    clipping.tasks.forEach((task) => {
      switch(task.state) {
        case 'completed':
          completedTasks.push(task);
          break;
        case 'failed':
          failedTasks.push(task);
          break;
        default:
          pendingTasks.push(task);
          break;
      }
      if(task.taskType === 'mainFileTask') {
        mainTask = task;
      }
    });

    const result = {
      clipId: clipping.info.clipId,
      filename: mainTask.fullFilename,
      downloadItemId: mainTask.downloadItemId,
      taskNum: clipping.tasks.length,
      failedTaskNum: failedTasks.length,
      pendingTaskNum: pendingTasks.length,
      completedTaskNum: completedTasks.length,
    }
    if(failedTasks.length > 0) {
      result.failedTasks = failedTasks;
    }
    return result;
  }

  function initClipIdDict(clipping) {
    clipping.tasks.forEach((task) => {
      clipIdDict.add(task.filename, task.clipId);
    });
  }

  function setTaskAttrs(clipping, taskFilename, attrs) {
    const task = clipping.tasks.find((task) => {
      return task.filename === taskFilename;
    })
    if(task) {
      for(let attrName in attrs) {
        task[attrName] = attrs[attrName];
      }
      return task;
    } else {
      throw new Error("Shouldn't reach here");
    }
  }

  function calcProgress(clipping) {
    let finished = 0;
    clipping.tasks.forEach((task) => {
      if(['failed', 'completed'].indexOf(task.state) > -1) {
        finished += 1;
      }
    });
    return [finished, clipping.tasks.length];
  }

  const SavingTool = {
    startSaving: startSaving,
    taskFailed: taskFailed,
    taskCompleted: taskCompleted
  }

  export default SavingTool;
