/* global marked */

import { assert } from 'chai';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';
import { decodeHtml } from '../utils/element-utils';

export default function createMarkdownPreviewerTests() {

  describe('Markdown Previewer tests', function() {

    // Save the values of the editor and preview.
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');

    let markdownOnLoad,
      previewOnLoad;
    if (editor) {
      markdownOnLoad = editor.value;
    }
    if (preview) {
      previewOnLoad = preview.innerHTML;
    }

    // Keeps track of which markdown was found.
    const markDownHas = {
      h1: false,
      h1Text: [],
      h2: false,
      h2Text: [],
      code: false,
      link: false,
      inlineCode: false,
      listItem: false,
      blockquote: false,
      image: false,
      bold: false
    };

    // Parse the editor value using markedjs and override some of the renderers
    // so we can easily detect what markup was used.
    function findMarkdownMatches(markdown) {
      const renderer = new marked.Renderer();

      renderer.heading = function(text, level) {
        text = decodeHtml(text);
        if (level === 1) {
          markDownHas.h1 = true;
          markDownHas.h1Text.push(text);
        } else if ( level === 2 ) {
          markDownHas.h2 = true;
          markDownHas.h2Text.push(text);
        }
        return '';
      };

      renderer.code = function() {
        markDownHas.code = true;
        return '';
      };

      renderer.link = function() {
        markDownHas.link = true;
        return '';
      };

      renderer.codespan = function() {
        markDownHas.inlineCode = true;
        return '';
      };

      renderer.listitem = function() {
        markDownHas.listItem = true;
        return '';
      };

      renderer.blockquote = function() {
        markDownHas.blockquote = true;
        return '';
      };

      renderer.image = function() {
        markDownHas.image = true;
        return '';
      };

      renderer.strong = function() {
        markDownHas.bold = true;
        return '';
      };

      marked(markdown, { renderer });
    }

    // At the beginning of the project, the Camper will might not have added
    // the markedjs library yet.
    if (typeof marked === 'function' ) {
      findMarkdownMatches(markdownOnLoad || '');
    }

    // As of React 15.6, we need a workaround that allows continued use of
    // el.dispatchEvent()
    // SEE: https://github.com/facebook/react/issues/10135

    // Do not try to delete non-configurable properties.
    function deletePropertySafe(elem, prop) {
      var desc = Object.getOwnPropertyDescriptor(elem, prop);
      if (desc && desc.configurable) {
        delete elem[prop];
      }
    }

    // This is a hack and is tightly coupled with React's implementation
    // details. https://github.com/vitalyq/react-trigger-change
    function reactTriggerChange(node) {
      // Cache artificial value property descriptor.
      // Property doesn't exist in React <15.6, descriptor is undefined.
      let descriptor = Object.getOwnPropertyDescriptor(node, 'value');

      // Update inputValueTracking cached value.
      // Remove artificial value property.
      // Restore initial value to trigger event with it.
      let initialValue = node.value;
      node.value = initialValue + '#';
      deletePropertySafe(node, 'value');
      node.value = initialValue;

      node.dispatchEvent(new Event('input', {bubbles: true}));

      // Restore artificial value property descriptor.
      if (descriptor) {
        Object.defineProperty(node, 'value', descriptor);
      }
    }

    // A change in the editor value won't be detected unless the correct event
    // is dispatched.
    function triggerChange(str) {
      editor.value = str;
      // React
      reactTriggerChange(editor);
      // jQUERY OR JAVASCRIPT
      // must be keyup to live preview
      const eventJS = new Event('keyup', {bubbles: true});
      editor.dispatchEvent(eventJS);
    }

    describe('#Technology Stack', function() {
      it(frontEndLibrariesStack, function() {
        return true;
      });
    });

    describe('#Tests', function() {

      it(`I can see a <textarea> element with corresponding
      id="editor"`,
      function() {
        assert.isNotNull(editor, '#editor is not defined ');
        assert.strictEqual(
          editor.nodeName,
          'TEXTAREA',
          '#editor should be a <textarea> element '
        );
      });

      it('I can see an element with corresponding id="preview"',
      function() {
        assert.isNotNull(preview, '#preview is not defined ');
      });

      it(`When I enter text into the #editor element, the #preview
      element is updated as I type to display the content of the textarea`,
      function() {
        // initial triggerChange is to enable writability and configurability
        // for the textarea Object.
        triggerChange('');
        triggerChange('a');
        assert.strictEqual(
          preview.innerText.slice(0, 1),
          'a',
          '#preview is not being updated as I type into #editor (should ' +
          'update on every keyup) '
        );
      });

      it(`When I enter GitHub flavored markdown into the #editor
      element, the text is rendered as HTML in the #preview element as I type
      (Hint: You don't need to parse Markdown yourself - you can import the
      Marked library for this: https://cdnjs.com/libraries/marked)`,
      function() {
        const error = 'The markdown in #editor is not being interpreted ' +
          'correctly and/or rendered into #preview ';
        triggerChange('');
        assert.strictEqual(
          preview.innerHTML,
          '',
          '#preview\'s only children should be those rendered by marked.js '
        );
        triggerChange('testing');
        assert.strictEqual(preview.innerHTML, '<p>testing</p>\n', error);
        triggerChange(editor.value + ' and...');
        assert.strictEqual(preview.innerHTML, '<p>testing and...</p>\n', error);
        triggerChange('# h1 \n## h2');
        assert.isTrue(
          preview.children.length === 2 &&
          preview.children[0].nodeName === 'H1' &&
          preview.children[0].innerHTML === 'h1' &&
          preview.children[1].nodeName === 'H2' &&
          preview.children[1].innerHTML === 'h2',
          '"# h1 \n## h2" should be rendered as <h1>h1</h1>\n<h2>h2</h2>\n'
        );
        triggerChange('**bold**');
        assert.strictEqual(
          preview.innerHTML,
          '<p><strong>bold</strong></p>\n',
          error
        );
      });

      it(`When my markdown previewer first loads, the default text in
      the #editor field should contain valid markdown that represents at least
      one of each of the following elements: a header (H1 size), a sub header
      (H2 size), a link, inline code, a code block, a list item, a blockquote,
      an image, and bolded text`,
      function() {

        assert.notStrictEqual(
          markdownOnLoad,
          'undefined',
          '#editor value is undefined '
        );
        assert.notStrictEqual(
          markdownOnLoad,
          '',
          '#editor does not contain any text '
        );

        // h1
        assert.isTrue(
          markDownHas.h1,
          'write some markdown representing an <h1> '
        );

        // h2
        assert.isTrue(
          markDownHas.h2,
          'write some markdown representing an <h2> '
        );

        // link
        assert.isTrue(
          markDownHas.link,
          'write some markdown representing an <a> '
        );

        // inline code
        assert.isTrue(
          markDownHas.inlineCode,
          'write some markdown representing inline <code> '
        );

        // codeblock
        assert.isTrue(
          markDownHas.code,
          'write some markdown representing a codeblock, i.e. <pre><code>...' +
          '</code></pre> '
        );

        // ol or ul list item
        assert.isTrue(
          markDownHas.listItem,
          'write some markdown representing an <li> item '
        );

        // blockquote
        assert.isTrue(
          markDownHas.blockquote,
          'write some markdown representing a <blockquote> '
        );

        // image
        assert.isTrue(
          markDownHas.image,
          'write some markdown representing an <image> '
          );

          // bold text
        assert.isTrue(
          markDownHas.bold,
          'write some markdown representing <strong> text '
        );
      });

      it(`When my markdown previewer first loads, the default
      markdown in the #editor field should be rendered as HTML in the #preview
      element`,
      function() {

        triggerChange(markdownOnLoad);
        assert.notStrictEqual(
          preview.innerHTML,
          '',
          '#preview should have inner HTML '
        );
        assert.strictEqual(
          preview.innerHTML,
          previewOnLoad,
          '#editor\'s  markdown does not render correctly on window load '
        );
        // this could be significantly shortened into one test, however
        // feedback would not be specific
        assert.isAtLeast(
          document.querySelectorAll('#preview h1').length,
          1,
          '#preview does not contain at least one <h1> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview h2').length,
          1,
          '#preview does not contain at least one <h2> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview a').length,
          1,
          '#preview does not contain at least one <a> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview code').length,
          1,
          '#preview does not contain at least one <code> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview pre').length,
          1,
          '#preview does not contain at least one <pre> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview li').length,
          1,
          '#preview does not contain at least one <li> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview blockquote').length,
          1,
          '#preview does not contain at least one <blockquote> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview img').length,
          1,
          '#preview does not contain at least one <img> '
        );
        assert.isAtLeast(
          document.querySelectorAll('#preview strong').length,
          1,
          '#preview does not contain at least one <strong> '
        );

        // then check a couple of elements to make sure the present elements
        // are actually the ones represented by the markdown:

        // find matching H1 element
        let hasH1 = [].slice.call(document.querySelectorAll('#preview h1'))
          .some(h1 => {
            let innerHTML = h1.innerHTML.trim();
            return markDownHas.h1Text.some(text => innerHTML === text);
          });
        assert.isTrue(
          hasH1,
          '#preview does not contain the H1 element represented by the ' +
          'markdown in the #editor field '
        );

        // find matching H2 element
        let hasH2 = [].slice.call(document.querySelectorAll('#preview h2'))
          .some(h2 => {
            let innerHTML = h2.innerHTML.trim();
            return markDownHas.h2Text.some(text => innerHTML === text);
          });
        assert.isTrue(
          hasH2,
          '#preview does not contain the H2 element represented by the ' +
          'markdown in the #editor field '
        );

      });

      it(`OPTIONAL BONUS (you do not need to make this test pass):
      My markdown previewer interprets carriage returns and renders them as <br>
      (line break) elements (HINT: read the Marked.js docs for this one!).`,
      function() {
        let brCount;

        // This markup should produce two <br> elements.
        triggerChange(
          `First line.
           Second line, same paragraph.
           Third line, same paragraph.`
        );

        // Count number of <br> elements in the preview area.
        brCount = (preview.innerHTML.match(/<br>/g) || []).length;

        // Restore the original markdown before the assertion. This is to not
        // surprise the Camper who all of a sudden sees something
        // unexpected in their editor and preview areas.
        triggerChange(markdownOnLoad);

        assert.strictEqual(
          brCount,
          2,
          'See the marked.js options for this and other cool features '
        );
      });

    // END #Tests
    });

  // END Mardown Previewer tests
  });

// END createMarkdownPreviewerTests()
}
