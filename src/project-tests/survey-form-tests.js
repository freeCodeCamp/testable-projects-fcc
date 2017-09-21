import { assert } from 'chai';
import { responsiveWebDesignStack } from '../utils/shared-test-strings';

export default function createSurveyFormTests() {

  describe('Survey Form tests', function() {

    describe('#Technology Stack', function() {
      it(responsiveWebDesignStack, function() {
        assert.ok(true);
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. I can see a title with id="title" in H1 sized text.`,
      function() {
        const title = document.getElementById('title');
        assert.isNotNull(
          title,
          'There should be an element with id="title" '
        );
        assert.strictEqual(
          title.tagName,
          'H1',
          '#title should be in H1 sized text '
        );
        assert.isAbove(
          title.innerText.length,
          0,
          '#title should contain some text '
        );
      });

      reqNum++;
      it(`${reqNum}. I can see a short explanation with id="description" in P
      sized text.`,
      function() {
        const description = document.getElementById('description');
        assert.isNotNull(
          description,
          'There should be an element with id="description" '
        );
        assert.strictEqual(
          description.tagName,
          'P',
          '#description should be in P sized text '
        );
        assert.isAbove(
          description.innerText.length,
          0,
          '#description should contain some text '
        );
      });

      reqNum++;
      it(`${reqNum}. I can see a <form> with id="survey-form".`,
      function() {
        const form = document.getElementById('survey-form');
        assert.isNotNull(
          form,
          'There should be an element with id="survey-form" '
        );
        assert.strictEqual(
          form.tagName,
          'FORM',
          '#survey-form should be a <form>-element '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I am required to enter my name in
      a field with id="name".`,
      function() {
        const name = document.getElementById('name');
        assert.isNotNull(
          name,
          'There should be an input text field with id="name" '
        );
        assert.strictEqual(
          name.type,
          'text',
          'input field with id="name" should be a text field '
        );
        assert.isOk(
          name.required,
          'Name input field should be required '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #name').length,
          0,
          'The field with id="name" is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I am required to enter an email in
      a field with id="email".`,
      function() {
        const email = document.getElementById('email');
        assert.isNotNull(
          email,
          'There should be an input text field with id="email" '
        );
        assert.isOk(
          email.required,
          'Email input field should be required '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #email').length,
          0,
          'The field with id="email" is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. If I enter an email that is not formatted correctly, I will
      see an HTML5 validation error.`,
      function() {
        const email = document.getElementById('email');
        assert.strictEqual(
          email.type,
          'email',
          'Email field should be HTML5 validated '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form, I can enter a number in a field with
      id="number".`,
      function() {
        const number = document.getElementById('number');
        assert.isNotNull(
          number,
          'There should be an input text field with id="number" '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #number').length,
          0,
          'The field with id="number" is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. If I enter non-numbers in the number input, I will see an
      HTML5 validation error.`,
      function() {
        const number = document.getElementById('number');
        assert.strictEqual(
          number.type,
          'number',
          'Number field should be HTML5 validated '
        );
      });

      reqNum++;
      it(`${reqNum}. If I enter numbers outside the range of the number input, I
      will see an HTML5 validation error.'`,
      function() {
        const number = document.getElementById('number');
        assert.isNotNaN(
          parseInt(number.min, 10),
          'Minimum number should be defined '
        );
        assert.isNotNaN(
          parseInt(number.max, 10),
          'Maximum number should be defined '
        );
      });

      reqNum++;
      it(`${reqNum}. For the name, email, and number input fields inside the
      form I can see corresponding labels that describe the purpose of each
      field with the following ids: id="name-label", id="email-label", and
      id="number-label".`,
      function() {
        const nameLabel = document.getElementById('name-label');
        const emailLabel = document.getElementById('email-label');
        const numberLabel = document.getElementById('number-label');
        assert.isNotNull(
          nameLabel,
          '#name-label is not defined '
        );
        assert.strictEqual(
          nameLabel.nodeName,
          'LABEL',
          '#name-label should be a <label> element '
        );
        assert.isAbove(
          nameLabel.innerText.length,
          0,
          '#name-label should contain some text '
        );
        assert.isNotNull(
          emailLabel,
          '#email-label is not defined '
        );
        assert.strictEqual(
          emailLabel.nodeName,
          'LABEL',
          '#email-label should be a <label> element '
        );
        assert.isAbove(
          emailLabel.innerText.length,
          0,
          '#email-label should contain some text '
        );
        assert.isNotNull(
          numberLabel,
          '#number-label is not defined '
        );
        assert.strictEqual(
          numberLabel.nodeName,
          'LABEL',
          '#number-label should be a <label> element '
        );
        assert.isAbove(
          numberLabel.innerText.length,
          0,
          '#number-label should contain some text '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #name-label').length,
          0,
          'The label with id="name-label" is not inside the form element '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #email-label').length,
          0,
          'The label with id="email-label" is not inside the form element '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #number-label').length,
          0,
          'The label with id="number-label" is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. For the name, email, and number input fields, I can see
      placeholder text that gives me a description or instructions for each
      field.'`,
      function() {
        assert.strictEqual(
          document.getElementById('name').hasAttribute('placeholder'),
          true,
          'The name input field should have a placeholder attribute '
        );
        assert.isAbove(
          document.getElementById('name').placeholder.length,
          0,
          'The name input field\'s placeholder attribute should have ' +
          'some text for its value'
        );
        assert.strictEqual(
          document.getElementById('email').hasAttribute('placeholder'),
          true,
          'The email input field should have a placeholder attribute '
        );
        assert.isAbove(
          document.getElementById('email').placeholder.length,
          0,
          'The email input field\'s placeholder attribute should have ' +
          'some text for its value'
        );
        assert.strictEqual(
          document.getElementById('number').hasAttribute('placeholder'),
          true,
          'The number input field should have a placeholder attribute '
        );
        assert.isAbove(
          document.getElementById('number').placeholder.length,
          0,
          'The number input field\'s placeholder attribute should have ' +
          'some text for its value '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I can select an option from a
      dropdown that has corresponding id="dropdown".'`,
      function() {
        const dropdown = document.getElementById('dropdown');
        const dropdownTag = dropdown.tagName;
        let inputSibling = null;
        let inputName = null;
        if (dropdownTag === 'DATALIST') {
          inputSibling = dropdown.previousElementSibling;
          inputName = inputSibling.getAttribute('list');
          assert.strictEqual(
            inputName,
            'dropdown',
            'When using the datalist tag, the accompanying input tag must ' +
            'contain a name attribute matching the datalist id.'
          );
        }
        assert.isNotNull(
          dropdown,
          'There should be a select field with id="dropdown" '
        );
        assert.isAtLeast(
          document.querySelectorAll('#dropdown option:not([disabled])').length,
          2,
          'Select should contain at least 2 selectable options '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #dropdown').length,
          0,
          'The select field with id="dropdown" is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I can select a field from one or
      more groups of radio buttons. Each group should be grouped using the name
      attribute.`,
      function() {
        let groups;
        // [].slice.call converts to array.
        const radioButtons = [].slice.call(
          document.querySelectorAll('input[type="radio"]')
        );

        assert.isAtLeast(
          radioButtons.length,
          2,
          'There should be at least 2 radio buttons '
        );
        assert.isAtLeast(
          document.querySelectorAll('#survey-form input[type="radio"]').length,
          2,
          'There should be at least 2 radio buttons inside the #survey-form '
        );
        assert.strictEqual(
          radioButtons.length,
          document.querySelectorAll(
            'input[value][type="radio"]:not([value=""])'
          ).length,
          'All your radio-buttons must have a value attribute '
        );

        assert.strictEqual(
          radioButtons.length,
          document.querySelectorAll(
            'input[name][type="radio"]:not([name=""])'
          ).length,
          'All your radio-buttons need a name attribute '
        );

        // Count the number of radio buttons per group.
        groups = radioButtons.reduce((groups, radioButton) => {
          if (groups.hasOwnProperty(radioButton.name)) {
            groups[radioButton.name]++;
          } else {
            groups[radioButton.name] = 1;
          }
          return groups;
        }, {});

        // Make sure each group has at least two radio buttons.
        for (var group in groups) {
          if (Object.prototype.hasOwnProperty.call(groups, group)) {
            console.log(groups[group]);
            assert.isAtLeast(
              groups[group],
              2,
              'Every radio-button group should have at least 2 radio buttons '
            );
          }
        }
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I can select several fields from a
      series of checkboxes, each of which must have a value attribute.`,
      function() {
        const checkboxes = document.querySelectorAll(
          '#survey-form input[type="checkbox"]'
        );
        assert.isAtLeast(
          checkboxes.length,
          2,
          'There should be at least 2 checkboxes inside the form '
        );
        assert.strictEqual(
          checkboxes.length,
          document.querySelectorAll(
            '#survey-form input[value][type="checkbox"]:not([value=""]'
          ).length,
          'All your checkboxes must have a value attribute '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I am presented with a <textarea>
      at the end for additional comments.'`,
      function() {
        const textareas = document.getElementsByTagName('textarea');
        assert.isAtLeast(
          textareas.length,
          1,
          'There should be at least 1 <textarea> '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form textarea').length,
          0,
          'The textarea is not inside the form element '
        );
      });

      reqNum++;
      it(`${reqNum}. Inside the form element, I am presented with a button with
      id="submit" to submit all my inputs.`,
      function() {
        const button = document.getElementById('submit');
        assert.isNotNull(
          button,
          'There should be a button with id="submit" '
        );
        if (button.nodeName === 'INPUT') {
          assert.strictEqual(
            button.hasAttribute('type'),
            true,
            'If you are using an <input> element for your button you need to ' +
            'define a type attribute '
          );
        }
        assert.strictEqual(
          button.type,
          'submit',
          'Your button\'s type attribute should have a value of "submit" '
        );
        assert.isAbove(
          document.querySelectorAll('#survey-form #submit').length,
          0,
          'The button with id="submit" is not inside the form element '
        );
      });

    // END #Content
    });

  // END Survery Form tests
  });

// END createSurveyFormTests()
}
