  "use strict";

  import I18N from './translation.js';
  import T from './tool.js';

  const MxWcTemplate = {}

  MxWcTemplate.options = {
    render: function(v) {
      const tpl = '<a data-value="${value}" i18n="${i18nKey}"></a>';
      return v.options.map((it) => {
        const i18nKey = ['option', v.type, it, 'name'].join('.');
        return T.renderTemplate(tpl, {
          value: it,
          i18nKey: i18nKey
        });
      }).join("\n");
    }
  }

  MxWcTemplate.framePage = {
    render: function(v){
      return `
  <!DOCTYPE html>
  <html>
    <!-- ${v.originalSrc} -->
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>${v.title}</title>
      ${v.headInnerHtml}
    </head>
    ${v.html}
  </html>`;
    }
  }

  MxWcTemplate.elemPage = {
    render: function(v){
    return `
  <!DOCTYPE html>
  <html id="${v.htmlId}" class="${v.htmlClass}">
    <!-- OriginalSrc: ${v.info.link} -->
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>${v.info.title}</title>
      ${v.headInnerHtml}
      <style class="mx-wc-style">
        body {padding-top: 20px;}
        .mx-wc-main img {max-width: 100%;}
        .mx-wc-main{
          box-sizing: content-box;
          background-color: ${v.outerElemBgCss} !important;
          margin: 0 auto;
          max-width: ${v.elemWidth}px;
        }
        @media (min-width: 768px) {
          .mx-wc-main { padding: 15px 15px 80px 15px }
        }
        @media (max-width: 767px) {
          .mx-wc-main { padding: 15px 3px 80px 3px }
        }
  ${MxWcTemplate.clippingInformationStyle.render(v)}
      </style>
    </head>
    <body style="background-color: ${v.bodyBgCss} !important; min-height: 100%; height: auto; position: static !important; overflow: auto !important; padding-bottom: 0px !important;" id="${v.bodyId}" class="${v.bodyClass}">
      <div class="mx-wc-main">
        ${v.elemHtml}
        ${MxWcTemplate.clippingInformation.render(v)}
      </div>
    </body>
  </html>`;
    }
  }


  MxWcTemplate.bodyPage = {
    render: function(v) {
      const infoHtml = MxWcTemplate.clippingInformation.render(v);
      const bodyHtml = T.replaceLastMatch(
        v.elemHtml, /<\/body>/img,
        [infoHtml, "</body>"].join("\n")
      );
      const clippingInfoStyle = MxWcTemplate.clippingInformationStyle.render(v);
      const mxWcStyle = (clippingInfoStyle === '' ? '' : `<style class="mx-wc-style">${clippingInfoStyle}</style>`);
    return `
  <!DOCTYPE html>
  <html id="${v.htmlId}" class="${v.htmlClass}">
    <!-- OriginalSrc: ${v.info.link} -->
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>${v.info.title}</title>
      ${v.headInnerHtml}
      ${mxWcStyle}
    </head>
    ${bodyHtml}
  </html>`;
    }
  }
  MxWcTemplate.clippingInformationStyle = {
    render: function(v) {
      if(v.config.htmlSaveClippingInformation){
        return `
        .clipping-information{
          text-align: left !important;
          margin-top: 20px !important;
          background-color: #eeeeee !important;
          padding: 15px !important;
          border-radius: 4px;
          color: #333 !important;
          font-size: 14px !important;
          line-height: 22px !important;
        }
        .clipping-information a {
          color: blue !important;
          text-decoration: underline !important;
        }
        .clipping-information label {
          font-weight: normal !important;
          display: inline !important;
          text-transform: none !important;
        }
        .clipping-information label > code {
          color: #333 !important;
          padding: 2px 8px !important;
          background-color: rgba(200, 200, 200, 0.7)!important;
          font-size: 14px !important;
        }
       `;
      } else {
        return '';
      }
    }
  }

  MxWcTemplate.clippingInformation = {
    render: function(v) {
      if(v.config.htmlSaveClippingInformation){
        let tagHtml = I18N.t('none');
        if(v.info.tags.length > 0) {
          tagHtml = T.map(v.info.tags, function(tag) {
            return "<code>" + tag + "</code>";
          }).join(", ");
        }
        let categoryHtml = I18N.t('none');
        if(v.info.category){
          categoryHtml = v.info.category;
        }
        return `
          <hr />
          <!-- clipping information -->
          <div class="clipping-information">
            <label>${I18N.t('original-url')}: <a href="${v.info.link}" target="_blank" referrerpolicy="no-referrer" rel="noopener noreferrer">${I18N.t('access')}</a></label><br />
            <label>${I18N.t('created-at')}: ${v.info.created_at}</label><br />
            <label>${I18N.t('category')}: ${categoryHtml}</label><br />
            <label>${I18N.t('tags')}: ${tagHtml}</label>
          </div>`;
      } else {
        return '';
      }
    }
  }

  export default MxWcTemplate;
