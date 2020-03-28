const JSDOM = require('jsdom').JSDOM;
const jsdom = new JSDOM();
const win = jsdom.window;
const H = require('./helper.js');
const DOMTool = H.depJs('lib/dom-tool.js');
const CaptureTool = H.depJs('capturer/tool.js');

describe('CaptureTool', () => {

  describe('captureBackgroundAttr', () => {

    function getNode() {
      const {node} = DOMTool.parseHTML(win, '<div></div>');
      return node;
    }

    function getParams() {
      return {
        baseUrl: 'https://a.org/index.html',
        storageInfo: {
          assetFolder: 'category-a/clippings/assets',
          assetRelativePath: 'assets'
        },
        clipId: '001',
        config: { saveCssImage: true }
      }
    }

    it('it should capture empty background', () => {
      const node = getNode();
      const params = getParams();
      const r = CaptureTool.captureBackgroundAttr(node, params);
      H.assertEqual(r.tasks.length, 0);
    });

    it('it should capture background', () => {
      const node = getNode();
      node.setAttribute('background', 'assets/a.jpg');
      const params = getParams();
      const r = CaptureTool.captureBackgroundAttr(node, params);
      H.assertEqual(r.tasks.length, 1);
    });

    it('it should not capture background if config is not true', () => {
      const node = getNode();
      node.setAttribute('background', 'assets/a.jpg');
      const params = getParams();
      params.config.saveCssImage = false;
      const r = CaptureTool.captureBackgroundAttr(node, params);
      H.assertEqual(r.tasks.length, 0);
    });

  });

  describe('parseSrcset', () => {

    it('should handle one url', () => {
      const srcset = "https://a.org/a.jpg";
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 1);
      H.assertEqual(arr[0].length, 1);
    });

    it('should handle multiple urls - comma + space', () => {
      const srcset = "https://a.org/a.jpg, https://a.org/b.jpg";
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 2);
    });

    it('should handle multiple urls - comma (invalid)', () => {
      const srcset = "https://a.org/a.jpg,https://a.org/b.jpg";
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 1);
      H.assertEqual(arr[0].length, 1);
      H.assertEqual(arr[0][0], srcset);
    });

    it('should handle urls with descriptor - comma + space', () => {
      const srcset = "https://a.org/a-200.jpg 1x, https://a.org/a-400.jpg 2x"
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 2);
      H.assertEqual(arr[0][1], '1x');
      H.assertEqual(arr[1][1], '2x');
    });

    it('should handle urls with descriptor - comma', () => {
      const srcset = "https://a.org/a-200.jpg 200w,https://a.org/a-400.jpg 400w"
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 2);
      H.assertEqual(arr[0][1], '200w');
      H.assertEqual(arr[1][1], '400w');
    });

    it('should handle url that contains comma', () => {
      const srcset = "https://a.org/foo,bar/a.jpg 1x, https://a.org/foo,bar/b.jpg 2x";
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 2);
      H.assertEqual(arr[0][1], '1x');
      H.assertEqual(arr[1][1], '2x');
    });


    it('should handle data url', () => {
      const srcset = "data:image/webp;base64,aaa 1x, data:image/jpeg;base64,bbb 2x";
      const arr = CaptureTool.parseSrcset(srcset);
      H.assertEqual(arr.length, 2);
      H.assertEqual(arr[0][1], '1x');
      H.assertEqual(arr[1][1], '2x');
    });
  });

});

