  "use strict";

  import Log from '../js/lib/log.js';
  import T from '../js/lib/tool.js';
  import I18N from '../js/lib/translation.js';
  import ExtMsg from '../js/lib/ext-msg.js';
  import MxWcStorage from '../js/lib/storage.js';
  import MxWcConfig from '../js/lib/config.js';
  import MxWcLink from '../js/lib/link.js';
  import MxWcTemplate from '../js/lib/template.js';
  import Notify from '../js/lib/notify.js';
  import MxWcHandler from '../js/lib/handler.js';

  import './_base.css';
  import './setting.css';

// http://kb.mozillazine.org/Firefox_:_Issues_:_Links_to_Local_Pages_Don%27t_Work

  function updateConfig(key, value) {
    const isUpdated = MxWcConfig.update(key, value);
    const keys = ['hotkeySwitchEnabled'];
    if(keys.indexOf(key) > -1) {
      ExtMsg.broadcastToContent({
        type: 'config.changed',
        body: { key: key, value: value }
      });
    }
    return isUpdated;
  }

  // ======================================
  // init form inputs
  // ======================================

  function initSettingGeneral(config) {
    // clipping content
    initCheckboxInput(config,
      'save-domain-as-tag',
      'saveDomainAsTag'
    );

    // - html
    initCheckboxInput(config,
      'html-save-clipping-information',
      'htmlSaveClippingInformation'
    );
    initCheckboxInput(config,
      'save-icon',
      'saveIcon'
    );
    initCheckboxInput(config,
      'save-web-font',
      'saveWebFont'
    );
    initCheckboxInput(config,
      'save-css-image',
      'saveCssImage'
    );
    // - markdown
    initCheckboxInput(config,
      'md-save-clipping-information',
      'mdSaveClippingInformation'
    );
    initCheckboxInput(config,
      'md-front-matter-enabled',
      'mdFrontMatterEnabled'
    );
    initTextInput(config,
      'md-front-matter-template',
      'mdFrontMatterTemplate'
    );


    // control
    initCheckboxInput(config,
      'hotkey-switch-enabled',
      'hotkeySwitchEnabled',
    );

    initCheckboxInput(config,
      'mouse-mode-enabled',
      'mouseModeEnabled',
    );

    initCheckboxInput(config,
      'input-field-save-format-enabled',
      'inputFieldSaveFormatEnabled',
    );

    initCheckboxInput(config,
      'remember-selection',
      'rememberSelection',
    );

    // File url access
    initCheckboxInput(config,
      'file-scheme-access-input',
      'allowFileSchemeAccess'
    );

  }

  // section: Storage
  function initSettingStorage(config) {
    initOptionsInput(config,
      'storage-handler',
      'clippingHandler'
    );
  }

  function initSettingAssistant(config) {
    initCheckboxInput(config,
      'assistant-enabled',
      'assistantEnabled'
    );
    initCheckboxInput(config,
      'auto-update-public-plan',
      'autoUpdatePublicPlan'
    );
  }

  // section: handler-browser
  function initSettingHandlerBrowser(config) {
    initCheckboxInput(config,
      'handler-browser-enabled',
      'handlerBrowserEnabled'
    );
  }

  // section: handler-native-app
  function initSettingHandlerNativeApp(config) {
    initCheckboxInput(config,
      "handler-native-app-enabled",
      "handlerNativeAppEnabled",
    );
  }

  // section: handler-zip
  function initSettingHandlerZip(config) {
    initCheckboxInput(config,
      'handler-zip-enabled',
      'handlerZipEnabled'
    );
  }

  // section: handler-WizNotePlus
  function initSettingHandlerWizNotePlus(config) {
    initCheckboxInput(config,
      "handler-wiz-note-plus-enabled",
      "handlerWizNotePlusEnabled",
    );
  }

  function initSettingSaveFormat(config){
    initOptionsInput(config,
      'save-format',
      'saveFormat'
    );
  }

  // local path relative
  function initSettingPath(config) {

    initTextInput(config,
      'root-folder',
      'rootFolder'
    );

    initTextInput(config,
      'default-category',
      'defaultCategory'
    );

    initTextInput(config,
      'clipping-folder-name',
      'clippingFolderName'
    );

    initTextInput(config,
      'main-file-folder',
      'mainFileFolder',
    );

    initTextInput(config,
      'main-file-name',
      'mainFileName',
    );

    initTextInput(config,
      'asset-folder',
      'assetFolder'
    );

    initTextInput(config,
      'frame-file-folder',
      'frameFileFolder'
    );

    initTextInput(config,
      'info-file-folder',
      'infoFileFolder',
    );

    initTextInput(config,
      'info-file-name',
      'infoFileName',
    );

    initCheckboxInput(config,
      'save-title-file',
      'saveTitleFile'
    );

    initTextInput(config,
      'title-file-folder',
      'titleFileFolder',
    );

    initTextInput(config,
      'title-file-name',
      'titleFileName',
    );
  }

  // section: refresh history
  function initRefreshHistory(config) {
    initOptionsInput(config,
      'refresh-history-handler',
      'refreshHistoryHandler'
    );

    initCheckboxInput(config,
      'auto-refresh-history',
      'autoRefreshHistory'
    );
  }

  // section: offline page
  function initOfflinePage(config) {
    initOptionsInput(config,
      'offline-page-handler',
      'offlinePageHandler'
    );

    initCheckboxInput(config,
      'autogenerate-clipping-js',
      'autogenerateClippingJs'
    );
    initTextInput(config,
      'clipping-js-path',
      'clippingJsPath'
    );
  }

  function initSettingAdvanced(config) {

    initNumberInput(config,
      'request-timeout-input',
      'requestTimeout'
    );

    initCheckboxInput(config,
      'communicate-with-third-party',
      'communicateWithThirdParty'
    );

    initRadioInput(config,
      'request-referrer-policy',
      'requestReferrerPolicy',
    );

  }

  // ======================================
  // init form input END
  // ======================================

  function setConfigKey(elem, key) {
    elem.setAttribute('data-config-key', key);
  }

  function getConfigKey(elem) {
    return elem.getAttribute('data-config-key');
  }

  function initCheckboxInput(config, elemId, configKey){
    const elem = T.findElem(elemId);
    elem.checked = config[configKey];
    setConfigKey(elem, configKey);
    T.bindOnce(elem, 'change', checkBoxChanged)
  }

  function checkBoxChanged(e) {
    const configKey = getConfigKey(e.target);
    updateConfig(configKey, e.target.checked);
  }

  function initRadioInput(config, elemId, configKey){
    const elem = T.findElem(elemId);
    setConfigKey(elem, configKey);
    T.bindOnce(elem, 'change', radioInputChanged)
    checkRadioInput(elem, config[configKey]);
  }

  function radioInputChanged(e) {
    const container = T.findParentById(e.target, e.target.name);
    const configKey = getConfigKey(container);
    updateConfig(configKey, e.target.value);
  }

  function checkRadioInput(container, value) {
    const radioInputs = T.queryElems(`input[type=radio]`, container);
    radioInputs.forEach((it) => {
      if(it.value === value) {
        it.checked = true;
      }
    });
  }

  function initTextInput(config, elemId, configKey){
    const elem = T.findElem(elemId);
    elem.value = config[configKey];
    setConfigKey(elem, configKey);
    T.bindOnce(elem, 'blur', textInputBlured);
  }

  function textInputBlured(e) {
    const configKey = getConfigKey(e.target);
    const value = e.target.value.trim();
    e.target.value = value;
    if(updateConfig(configKey, value)){
      Notify.success(I18N.t('op.update-success'));
    }
  }

  function initNumberInput(config, elemId, configKey) {
    const elem = T.findElem(elemId);
    elem.value = config[configKey];
    setConfigKey(elem, configKey);
    T.bindOnce(elem, 'change', NumberInputChanged)
  }

  function NumberInputChanged(e) {
    const elem = e.target;
    const configKey = getConfigKey(elem);
    const value = parseInt(elem.value.trim());
    if (isNaN(value)) {
      Notify.error(I18N.t('error.not-a-number'));
      return;
    }
    const min = parseInt(elem.min);
    const max = parseInt(elem.max);
    if (value < min || value > max) {
      Notify.error(I18N.t('error.not-in-allowed-range'));
      return;
    }
    elem.value = value.toString();
    if(updateConfig(configKey, value)){
      Notify.success(I18N.t('op.update-success'));
    }
  }

  function initOptionsInput(config, elemId, configKey){
    const elem = T.findElem(elemId);
    setConfigKey(elem, configKey);
    T.bindOnce(elem, 'click', optionChanged);
    updateOptionsState(elem, config[configKey]);
  }

  function optionChanged(e) {
    if(e.target.tagName.toUpperCase() === 'A'){
      const elem = e.target.parentElement;
      const configKey = getConfigKey(elem);
      const value = e.target.getAttribute('data-value');
      updateConfig(configKey, value)
      updateOptionsState(elem, value)
    }
  }

  function updateOptionsState(elem, value) {
    let matched = false;
    T.each(elem.children, (option) => {
      const optionValue = option.getAttribute('data-value');
      if(optionValue === value){
        matched = true
        if(!option.classList.contains('active')) {
          option.classList.add('active');
          updatePageContentIfNeed(elem.id, value);
        }
      } else {
        option.classList.remove('active');
      }
    });
    if(!matched && elem.children.length > 0) {
      // If reach here (matched is false). It means the configured value is not in options.
      // So we choose first child as configured value.
      const firstValue = elem.children[0].getAttribute('data-value');
      const configKey = getConfigKey(elem);
      // We've got two config update here.
      // To avoid race condition, execute this update next tick.
      setTimeout(() => updateConfig(configKey, firstValue), 0)
      updateOptionsState(elem, firstValue);
    }
  }

  function updatePageContentIfNeed(elemId, value) {
    switch(elemId) {
      case 'storage-handler':
        storageHandlerChanged(value);
        break;
      case 'offline-page-handler':
        offlinePageHandlerChanged(value);
        break;
      case 'refresh-history-handler':
        refreshHistoryHandlerChanged(value)
        break;
    }
  }

  function storageHandlerChanged(value) {
    const sectionId = 'setting-storage';
    getHandlerStatusAndRenderNotice(sectionId, 'storage', value)
    .then(({isEnabled, handlerInfo, section}) => {
      T.queryElem('.save-format', section).classList.remove('active');
      T.queryElem('.local-path', section).classList.remove('active');
      if(isEnabled && handlerInfo.ready) {
        renderSaveFormat(section, handlerInfo.supportFormats);
        if(['Browser', 'NativeApp'].indexOf(value) > -1) {
          renderLocalPathOptions(section);
        }
      }
    });
  }

  function offlinePageHandlerChanged(value) {
    const sectionId = 'setting-offline-page';
    getHandlerStatusAndRenderNotice(sectionId, 'offline-page', value)
    .then(({isEnabled, handlerInfo, section}) => {
      const elem = T.queryElem('.detail', section);
      elem.classList.remove('active');
      if(isEnabled && handlerInfo.ready) {
        elem.classList.add('active');
      }
    });
  }

  function refreshHistoryHandlerChanged(value) {
    const sectionId = 'setting-refresh-history';
    getHandlerStatusAndRenderNotice(sectionId, 'refresh-history', value)
    .then(({isEnabled, handlerInfo, section}) => {
      const elem = T.queryElem('.detail', section);
      elem.classList.remove('active');
      if(isEnabled && handlerInfo.ready) {
        elem.classList.add('active');
      }
    });
  }

  function getHandlerStatusAndRenderNotice(sectionId, name, value) {
    return new Promise(function(resolve, reject) {
      const section = T.findElem(sectionId);
      const msgA = getNoticeMsg('info', [name, T.deCapitalize(value)]);
      const msgB = getNoticeMsg('warning', [name, T.deCapitalize(value)]);
      renderNoticeBox(section, 'info', msgA);
      renderNoticeBox(section, 'warning', msgB);
      MxWcHandler.isReady(value)
      .then((result) => {
        const {ok, message, enabled, handlerInfo} = result;
        if(ok) {
          renderNoticeBox(section, 'danger', '$BLANK');
        } else {
          renderNoticeBox(section, 'danger', message);
        }
        resolve({
          isEnabled: enabled,
          handlerInfo: handlerInfo,
          section: section
        })
      });
    });
  }

  function renderLocalPathOptions(section) {
    const div = T.queryElem('.local-path', section);
    div.classList.add('active');
    MxWcConfig.load().then((config) => {
      initSettingPath(config);
    });
  }

  function renderSaveFormat(section, formats) {
    const div = T.queryElem('.save-format', section);
    div.classList.add('active');
    const html = MxWcTemplate.options.render({
      type: 'save-format',
      options: formats
    });
    const elem = T.queryElem('#save-format', section);
    T.setHtml(elem, html);
    MxWcConfig.load().then((config) => {
      initSettingSaveFormat(config)
    });
  }


  function getNoticeMsg(type, names) {
    return I18N.t('setting', 'notice', type, ...names);
  }

  function renderNoticeBox(section, type, msg) {
    const box = T.queryElem(`.${type}-box`, section);
    if(msg === "$BLANK") {
      T.setHtml(box, '');
    } else {
      renderNotice(type, box, msg);
    }
  }


  // type: 'info', 'danger', 'warning'
  function renderNotice(type, box, message) {
    const template = T.findElem('notice-tpl').innerHTML;
    const html = T.renderTemplate(template, {
      type: type,
      message: message
    });
    T.setHtml(box, html);
  };


  /* button click handlers */

  function generateClippingJsNow(e) {
    ExtMsg.sendToBackground({
      type: 'generate.clipping.js'
    }).then((result) => {
      if(result.ok) {
        const label = T.findElem('last-generate-clipping-js-time');
        T.setHtml(label, result.time);
        Notify.success(I18N.t('setting.generate-now-success.label'));
      } else {
        Notify.error(t(result.message))
      }
    });
    Notify.success(I18N.t('setting.generate-now-msg-sent.label'));
  }

  function refreshHistoryNow(e) {
    ExtMsg.sendToBackground({
      type: 'history.refresh'
    }).then((result) => {
      if(result.ok) {
        const label = T.findElem('last-refresh-history-time');
        T.setHtml(label, result.time);
        Notify.success(I18N.t('setting.refresh-now-success.label'));
      } else {
        Notify.error(t(result.message))
      }
    });
    Notify.success(I18N.t('setting.refresh-now-msg-sent.label'));
  }

  function renderSection(id) {
    const container = T.queryElem('.content');
    const template = getSectionTemplate(id);
    let render = () => {};
    switch(id) {
      case 'setting-general':
        render = renderSectionGeneral;
        break;
      case 'setting-storage':
        render = renderSectionStorage;
        break;
      case 'setting-assistant':
        render = renderSectionAssistant;
        break;
      case 'setting-handler-browser':
        render = renderSectionHandlerBrowser;
        break;
      case 'setting-handler-native-app':
        render = renderSectionHandlerNativeApp;
        break;
      case 'setting-handler-zip':
        render = renderSectionHandlerZip;
        break;
      case 'setting-handler-wiz-note-plus':
        render = renderSectionHandlerWizNotePlus;
        break;
      case 'setting-offline-page':
        render = renderSectionOfflinePage;
        break;
      case 'setting-refresh-history':
        render = renderSectionRefreshHistory;
        break;
      case 'setting-advanced':
        render = renderSectionAdvanced;
        break;
      default:
        throw new Error("Unknown section " + id)
    }
    render(id, container, template);
  }

  function getSectionTemplate(sectionId) {
    const tplId = ["section",  sectionId, "tpl"].join("-");
    return T.findElem(tplId).innerHTML;
  }


  function renderSectionGeneral(id, container, template) {
    const html = T.renderTemplate(template, {
      host: window.location.origin
    });
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingGeneral(config);
    });
  }

  function renderSectionAdvanced(id, container, template) {
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingAdvanced(config);
    });
  }

  function renderSectionStorage(id, container, template) {
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingStorage(config);
    });
  }

  function renderSectionAssistant(id, container, template) {
    const examplePlan = `  {
    "name" : "A example plan",
    "pattern" : "https://example.org/posts/**/*.html",
    "pick" : ".post",
    "hide" : [".post-btns", "div.comments"]
  }`;
    const defaultIndexUrl = MxWcLink.get('assistant.subscription.default.index');

    const html = T.renderTemplate(template, {});
    T.setHtml(container, html);
    renderSubscriptions();
    MxWcStorage.get('assistant.custom-plan.text', `[\n${examplePlan}\n]`).then((value) => {
      T.setElemValue('#custom-plans', value);
    });
    MxWcStorage.get('assistant.public-plan.subscription-text').then((value) => {
      const subscription = (value || defaultIndexUrl);
      T.setElemValue('#plan-subscription', subscription);
      if (!value) {
        MxWcStorage.set('assistant.public-plan.subscription-urls', [defaultIndexUrl]);
      }
    });
    MxWcConfig.load().then((config) => {
      initSettingAssistant(config);
    });
    bindButtonListener('update-public-plan-now', updatePublicPlans);
    bindButtonListener('save-plan-subscription', savePlanSubscription);
    bindButtonListener('save-custom-plan', saveCustomPlan);
  }

  function renderSubscriptions() {
    MxWcStorage.get('assistant.public-plan.subscriptions', [])
      .then((subscriptions) => {
        const elem = T.queryElem('.public-plan .subscription-list');
        if (subscriptions.length > 0) {
          const tpl = T.findElem('subscription-tpl').innerHTML;
          const html = T.map(subscriptions, (it) => {
            return T.renderTemplate(tpl, {
              name: it.name,
              size: it.size,
              version: it.latestVersion,
              t: btoa(it.url),
            });
          }).join('');
          T.setHtml(elem,  html);
        } else {
          T.setHtml(elem, '<tr><td colspan="4" i18n="no.record" align="center"></td></tr>');
        }
      });
  }

  function savePlanSubscription(e) {
    const text = T.getElemValue('#plan-subscription');
    const lines = text.split(/\n+/);
    const urls = [];
    const errors = [];
    lines.forEach((it) => {
      const lineText = it.trim();
      const commentRe = /^#/;
      if (!lineText.match(commentRe) && lineText !== '') {
        try {
          const url = new URL(lineText);
          urls.push(lineText);
        } catch(e) {
          errors.push([e.message, T.escapeHtml(lineText)].join(": "));
        }
      }
    });
    if (errors.length > 0) {
      Notify.error(errors.join('\n'));
    } else {
      MxWcStorage.set('assistant.public-plan.subscription-text', text);
      MxWcStorage.set('assistant.public-plan.subscription-urls', urls);
      Notify.success(I18N.t('op.saved'));
    }
  }

  function updatePublicPlans(e) {
    MxWcStorage.get('assistant.public-plan.subscription-urls', []).then((urls) => {
      ExtMsg.sendToBackground({type: 'update.public-plan', body: {urls: urls}})
        .then((result) => {
          const logs = [];
          result.forEach((it) => {
            if (it.ok) {
              const arr = [it.subscription.url];
              if (it.updated) {
                arr.push(" (updated)");
              } else {
                arr.push(" (up to date)");
              }
              logs.push(renderLog(arr.join('')));
            } else {
              logs.push(renderLog(it.message, true));
            }
          })

          const elem = T.findElem('update-public-plan-log');
          if (logs.length > 0) {
            logs.push(renderLog("Done! " + T.currentTime().time()));
          } else {
            logs.push("Not subscription");
          }
          T.setHtml(elem, logs.join(''));
          elem.classList.add('active');
          renderSubscriptions();
        })
    });
  }

  function renderLog(log, isError) {
    if (isError) {
      return `<div class="log failure">[failure] ${log}</div>`;
    } else {
      return `<div class="log success">&gt; ${log}</div>`;
    }
  }

  function saveCustomPlan(e) {
    const elem = T.findElem('custom-plans');
    try {
      const plans = JSON.parse(elem.value);
      if (plans instanceof Array) {
        ExtMsg.sendToBackground({
          type: 'save.custom-plan',
          body: {planText: elem.value}
        }).then((result) => {
          if (result.ok) {
            Notify.success(I18N.t('op.saved'));
          } else {
            Notify.error(result.message);
          }
        })
      } else {
        Notify.error(I18N.t('error.value-invalid'));
      }
    } catch(e) {
      Notify.error(I18N.t('error.value-invalid'));
    }
  }

  function renderSectionHandlerBrowser(id, container, template) {
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingHandlerBrowser(config);
    });
  }

  function renderSectionHandlerNativeApp(id, container, template) {
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingHandlerNativeApp(config);
    });
    ExtMsg.sendToBackground({
      type: 'handler.get-info',
      body: {name: 'NativeApp'}
    }).then((info) => {

      const section = T.findElem(id);
      if(info.ready) {
        const elem = T.queryElem('.version-value', section);
        elem.innerText = info.version
        T.queryElem('.version', section).classList.add('active');
      } else {
        // render errors
        let msg = I18N.t('setting.notice.danger.native-app-not-ready');
        msg = msg.replace('$MESSAGE', info.message);
        renderNoticeBox(section, 'danger', msg);
      }
    });
  }

  function renderSectionHandlerZip(id, container, template) {
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingHandlerZip(config);
    });
  }

  async function renderSectionHandlerWizNotePlus(id, container, template) {
    // Render html template
    const html = template;
    T.setHtml(container, html);
    MxWcConfig.load().then((config) => {
      initSettingHandlerWizNotePlus(config);
    });
    // Check the state of WizNotePlus
    const info = await ExtMsg.sendToBackground({
      type: 'handler.get-info',
      body: {name: 'WizNotePlus'}
    });
    // Notify the user
    const section = T.findElem(id);
    if(info.ready) {
      const msg = I18N.t("setting.notice.danger.wiz-note-plus-ready");
      renderNoticeBox(section, 'info', msg);
    } else {
      let msg = I18N.t('setting.notice.danger.wiz-note-plus-not-ready');
      msg = msg.replace('$MESSAGE', info.message);
      renderNoticeBox(section, 'danger', msg);
    }
  }

  function renderSectionOfflinePage(id, container, template) {
    MxWcStorage.get('lastGenerateClippingJsTime')
    .then((time) => {
      const html = T.renderTemplate(template, {
        lastGenerateClippingJsTime: (time || ''),
      });
      T.setHtml(container, html);
      MxWcConfig.load().then((config) => {
        initOfflinePage(config)
      });
      bindButtonListener('generate-clipping-js-now', generateClippingJsNow);
    });
  }

  function renderSectionRefreshHistory(id, container, template) {
    MxWcStorage.get('lastRefreshHistoryTime')
    .then((time) => {
      const html = T.renderTemplate(template, {
        lastRefreshHistoryTime: (time || ''),
      });
      T.setHtml(container, html);
      MxWcConfig.load().then((config) => {
        initRefreshHistory(config)
      });
      bindButtonListener('refresh-history-now', refreshHistoryNow);
    });
  }

  function bindButtonListener(id, handler){
    const btn = T.findElem(id);
    T.bindOnce(btn, 'click', handler);
  }


  function menuClicked(elem) {
    T.each(elem.parentNode.children, (menu) => {
      menu.classList.remove('active');
    });
    elem.classList.add('active');
    const sectionId = elem.href.split('#')[1];
    renderSection(sectionId);
  }


  function initSidebar(){
    const sidebar = T.queryElem('.sidebar');
    const sidebarFolder = T.queryElem('.sidebar-folder');
    T.bind(sidebarFolder, 'click', function(e) {
      if(e.target.classList.contains('active')) {
        e.target.classList.remove('active');
        // 9776 ☰
        T.setHtml(e.target, '&#9776;');
      } else {
        e.target.classList.add('active');
        T.setHtml(e.target, ">>");
      }
    }, true);
    T.bind(sidebar, 'click', function(e){
      const elem = e.target;
      if(elem.classList.contains('menu')) {
        menuClicked(elem);
      }
    });
  }

  function activeMenu() {
    const hash = (window.location.hash || "#setting-general");
    const menu = T.queryElem(`a[href="${hash}"]`);
    setTimeout(() => menuClicked(menu), 0)
  }

  function init(){
    I18N.i18nPage();
    initSidebar();
    ExtMsg.initPage('setting');
    MxWcLink.listen(document.body);
    activeMenu();
  }

  init();
