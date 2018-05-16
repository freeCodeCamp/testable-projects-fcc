/* global marked */

import { assert } from 'chai';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';

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

    // As of React 15.6, we need a workaround that allows continued use of
    // el.dispatchEvent()
    // SEE: https://github.com/facebook/react/issues/10135
    // the main idea is making the value writable and the Object configurable —
    // writable so that we can programmatically set the value in these
    // tests, and configurable so that the textarea Object can receive these
    // settings each test
    function withValue(value) {
      var d = withValue.d || (
        withValue.d = {
          enumerable: false,
          writable: true,
          configurable: true,
          value: null
        }
      );
      d.value = value;
      return d;
    }

    // A change in the editor value won't be detected unless the correct event
    // is dispatched.
    function triggerChange(str) {
      editor.value = str;
      if (preview.innerHTML !== marked(str) || editor.value !== str) {
        // REACT
        const eventReact = new Event('input', {bubbles: true});
        Object.defineProperty(editor, 'value', withValue(str));
        editor.dispatchEvent(eventReact);
        // If the React dispatch worked, we can already return.
        if (preview.innerHTML === marked(str)) {
          return;
        }
      }
      // jQUERY OR JAVASCRIPT
      // must be keyup to live preview
      const eventJS = new Event('keyup', {bubbles: true});
      editor.dispatchEvent(eventJS);
      return;

    }
    // We need to undo the configuration set in triggerChange after running
    // tests. The configuration was added to allow dispatchEvent for
    // programmatic value change in React 15.6
    // See https://stackoverflow.com/a/7144252/3530394
    after(function() {
      // remove the value attribute in order to remove the configuration
      delete editor.value;
      // restore default markdown text
      editor.value = markdownOnLoad;
    });

    describe('#Technology Stack', function() {
      it(frontEndLibrariesStack, function() {
        return true;
      });
    });

    describe('#Tests', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. I can see a <textarea> element with corresponding
      id="editor"`,
      function() {
        assert.isNotNull(editor, '#editor is not defined ');
        assert.strictEqual(
          editor.nodeName,
          'TEXTAREA',
          '#editor should be a <textarea> element '
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an element with corresponding id="preview"`,
      function() {
        assert.isNotNull(preview, '#preview is not defined ');
      });

      reqNum++;
      it(`${reqNum}. When I enter text into the #editor element, the #preview
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

      reqNum++;
      it(`${reqNum}. When I enter GitHub flavored markdown into the #editor
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
        assert.strictEqual(
          preview.innerHTML,
          '<h1 id="h1">h1</h1>\n<h2 id="h2">h2</h2>\n',
          error
        );
        triggerChange('**bold**');
        assert.strictEqual(
          preview.innerHTML,
          '<p><strong>bold</strong></p>\n',
          error
        );
      });

      reqNum++;
      it(`${reqNum}. When my markdown previewer first loads, the default text in
      the #editor field should contain valid markdown that represents at least
      one of each of the following elements: a header (H1 size), a sub header
      (H2 size), a link, inline code, a code block, a list item, a blockquote,
      an image, and bolded text`,
      function() {
        let markdown;

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

        triggerChange(markdownOnLoad);
        markdown = editor.value;

        // h1
        assert.notStrictEqual(
          markdown.search(/#\s.+/),
          -1,
          'write some markdown representing an <h1> '
        );

        // h2
        assert.notStrictEqual(
          markdown.search(/##\s.+/),
          -1,
          'write some markdown representing an <h2> '
        );

        // link
        assert.notStrictEqual(
          markdown.search(/\[.+\]\(.+\..+\)/),
          -1,
          'write some markdown representing an <a> '
        );

        // inline code
        assert.notStrictEqual(
          markdown.search(/`.+`/),
          -1,
          'write some markdown representing inline <code> '
        );

        // codeblock
        assert.notStrictEqual(
          markdown.search(/```[^]+```/),
          -1,
          'write some markdown representing a codeblock, i.e. <pre><code>...' +
          '</code></pre> '
        );

        // ol or ul list item
        assert.notStrictEqual(
          markdown.search(/(?:[-+*]|\d\.)\s[^|\s-*].+/),
          -1,
          'write some markdown representing an <li> item '
        );

        // blockquote
        // Amended 5/18 to test for the > character at the beginning of a line,
        // with or without whitespace
        assert.notStrictEqual(
          markdown.search(/^>.+/m),
          -1,
          'write some markdown representing a <blockquote> '
        );

        // image
        assert.notStrictEqual(
          markdown.search(/!\[.*\]\(.+\..+\)/),
          -1,
          'write some markdown representing an <image> '
          );

          // bold text
        assert.notStrictEqual(
          markdown.search(/(\*\*|__).+\1/),
          -1,
          'write some markdown representing <strong> text '
        );
      });

      reqNum++;
      it(`${reqNum}. When my markdown previewer first loads, the default
      markdown in the #editor field should be rendered as HTML in the #preview
      element`,
      function() {
        const markdown = editor.value;
        let h1Text,
          h1Match,
          h2Text,
          h2Match;

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

        /* Two ways of creating H(n) elements:
          1. ATX
            `# Example Heading`
            `## Example Subheading`
          2. setext
            `Example Heading
            ===`
            `Example Subheading
            ---`
        https://github.github.com/gfm/#setext-heading-underline

        // ATX
        /* Added the m modifier to match hashes at the beginning of a paragraph
        so that people using Setext headers to pass these tests can use
        ATX headings elsewhere in the document additionally.
        From regex101: 'm modifier: multi line. Causes ^ and $ to match the
        begin/end of each line (not only begin/end of string)' */
        const h1regexHash = RegExp(/^#\s.*/m);
        const h2regexHash = RegExp(/^##\s.*/m);

        // Setext
        /* the (.*) matches everything excluding line terminators, so the
        m modifier is not needed for matching Setext headings. */
        const h1regexEq = RegExp(/.*[\n\r]=+/);
        const h2regexDash = RegExp(/.*[\n\r]--+/);

        // if ATX, trim hash + space from string h1 text
        // if setext, isolate text from the rest of the string at line
        // terminator
        h1Text =
          ( (h1regexHash).test(markdown) ?
            (h1regexHash).exec(markdown)[0].slice(2) :
            (h1regexEq).exec(markdown)[0].split(/[\n\r]/)[0] );
        h1Match = [];
        document.querySelectorAll('#preview h1').forEach(h1 => {
          if (h1.innerText === h1Text) {
            h1Match.push(h1);
          }
        });
        assert.isAtLeast(
          h1Match.length,
          1,
          '#preview does not contain the H1 element represented by the ' +
          'markdown in the #editor field with the inner text ' + h1Text + ' '
        );

        // find matching H2 element
        h2Text =
          ( (h2regexHash).test(markdown) ?
            (h2regexHash).exec(markdown)[0].slice(3) :
            (h2regexDash).exec(markdown)[0].split(/[\n\r]/)[0] );
        h2Match = [];
        document.querySelectorAll('#preview h2').forEach(h2 => {
          if (h2.innerText === h2Text) {
            h2Match.push(h2);
          }
        });
        assert.isAtLeast(
          h2Match.length,
          1,
          '#preview does not contain the H2 element represented by the ' +
          'markdown in the #editor field with the inner text ' + h2Text + ' '
        );

      });

      reqNum++;
      it(`${reqNum}. OPTIONAL BONUS (you do not need to make this test pass):
      When I click a link rendered by my markdown previewer, the link is opened
      up in a new tab (HINT: read the Marked.js docs for this one!)`,
      function() {
        const links = document.querySelectorAll('#preview a');
        const targetLinks = document.querySelectorAll(
          '#preview a[target="_blank"]'
        );

        assert.isAtLeast(
          links.length,
          1,
          'There should be at least one link'
        );

        assert.strictEqual(
          links.length,
          targetLinks.length,
          'All Links should target _blank'
        );
      });

      reqNum++;
      it(`${reqNum}. OPTIONAL BONUS (you do not need to make this test pass):
      My markdown previewer interprets carriage returns and renders them as <br>
      (line break) elements`,
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
