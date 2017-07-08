export default function createSurveyFormTests() {
  /**
    Returns the number of elements that are selectable
    **/
  function getNumOptions(elems) {
    var numActive = 0;
    for (var i = 0; i < elems.length; i++) {
      var el = elems[i];
      if (!el.disabled) {
        numActive++;
      }
    }
    return numActive;
  }

  /**
    Returns the number of elements that have a value-attribute
    **/
  function getNumValues(elems) {
    var numValues = 0;
    for (var i = 0; i < elems.length; i++) {
      var el = elems[i];
      if (el.hasAttribute("value")) {
        numValues++;
      }
    }
    return numValues;
  }

  describe("Survey Form tests", function() {
    describe("#Content", function() {

      it('1. I can see a title with id="title" in H1 sized text.', function() {
        var title = document.getElementById('title');
        FCC_Global.assert.isNotNull(title, 'There should be an element with id="title" ');
        FCC_Global.assert.strictEqual(title.tagName, "H1", "#title should be in H1 sized text ");
        FCC_Global.assert.isAbove(title.innerText.length, 0, '#title should contain some text ');
      });

      it('2. I can see a short explanation with id="description" in P sized text.', function() {
        var description = document.getElementById('description');
        FCC_Global.assert.isNotNull(description, 'There should be an element with id="description" ');
        FCC_Global.assert.strictEqual(description.tagName, "P", "#description should be in P sized text ");
        FCC_Global.assert.isAbove(description.innerText.length, 0, '#description should contain some text ')
      });

      it('3. I am presented with a <form> with id="survey-form". The <form> must contain all other form elements.', function() {
        var form = document.getElementById("survey-form");
        FCC_Global.assert.isNotNull(form, 'There should be an element with id="survey-form" ');
        FCC_Global.assert.strictEqual(form.tagName, "FORM", "#survey-form should be a <form>-element ");
      });

      it('4. I am required to enter my name in a field with id="name".', function() {
        var name = document.getElementById("name");
        FCC_Global.assert.isNotNull(name, 'There should be an input text field with id="name" ');
        FCC_Global.assert.strictEqual(name.type, "text", 'input field with id="name" should be a text field ');
        FCC_Global.assert.isOk(name.required, "Name input field should be required ");
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #name").length, 0, 'The field with id="name" is not inside the form element ');
      })

      it('5. I am required to enter an email in a field with id="email".', function() {
        var email = document.getElementById("email");
        FCC_Global.assert.isNotNull(email, 'There should be an input text field with id="email" ');
        FCC_Global.assert.isOk(email.required, "Email input field should be required ");
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #email").length, 0, 'The field with id="email" is not inside the form element ');
      });

      it('6. If I enter an email that is not formatted correctly, I will see an HTML5 validation error.', function() {
        var email = document.getElementById("email");
        FCC_Global.assert.strictEqual(email.type, "email", "Email field should be HTML5 validated ");
      });

      it('7. I can enter a number in a field with id="number".', function() {
        var number = document.getElementById("number");
        FCC_Global.assert.isNotNull(number, 'There should be an input text field with id="number" ');
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #number").length, 0, 'The field with id="number" is not inside the form element ');
      });

      it('8. If I enter non-numbers in a number field, I will see an HTML5 validation error.', function() {
        var number = document.getElementById("number");
        FCC_Global.assert.strictEqual(number.type, "number", "Number field should be HTML5 validated ");
      });

      it('9. If I enter numbers outside the range of the number field, I will see an HTML5 validation error.', function() {
        var number = document.getElementById("number");
        FCC_Global.assert.isNotNaN(parseInt(number.min), "Minimum number should be defined ")
        FCC_Global.assert.isNotNaN(parseInt(number.max), "Maximum number should be defined ")
      });

      it('10. For the name, email, and number input fields, I can see corresponding labels that describe the purpose of each field with the following ids: id="name-label", id="email-label", and id="number-label".', function() {
        const nameLabel = document.getElementById('name-label');
        const emailLabel = document.getElementById('email-label');
        const numberLabel = document.getElementById('number-label');
        FCC_Global.assert.isNotNull(nameLabel, `#name-label is not defined `);
        FCC_Global.assert.strictEqual(nameLabel.nodeName, 'LABEL', '#name-label should be a <label> element ');
        FCC_Global.assert.isAbove(nameLabel.innerText.length, 0, '#name-label should contain some text ');
        FCC_Global.assert.isNotNull(emailLabel, `#email-label is not defined `);
        FCC_Global.assert.strictEqual(emailLabel.nodeName, 'LABEL', '#email-label should be a <label> element ');
        FCC_Global.assert.isAbove(emailLabel.innerText.length, 0, '#email-label should contain some text ');
        FCC_Global.assert.isNotNull(numberLabel, `#number-label is not defined `);
        FCC_Global.assert.strictEqual(numberLabel.nodeName, 'LABEL', '#number-label should be a <label> element ');
        FCC_Global.assert.isAbove(numberLabel.innerText.length, 0, '#number-label should contain some text ');
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #name-label").length, 0, 'The label with id="name-label" is not inside the form element ');
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #email-label").length, 0, 'The label with id="email-label" is not inside the form element ');
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #number-label").length, 0, 'The label with id="number-label" is not inside the form element ');
      });

      it('11. For the name, email, and number input fields, I can see placeholder text that gives me a description or instructions for each field.', function() {
        FCC_Global.assert.strictEqual(document.getElementById('name').hasAttribute('placeholder'), true, 'The name input field should have a placeholder attribute ');
        FCC_Global.assert.isAbove(document.getElementById('name').placeholder.length, 0, 'The name input field\'s placeholder attribute should have a value of some text ');
        FCC_Global.assert.strictEqual(document.getElementById('email').hasAttribute('placeholder'), true, 'The email input field should have a placeholder attribute ');
        FCC_Global.assert.isAbove(document.getElementById('email').placeholder.length, 0, 'The email input field\'s placeholder attribute should have a value of some text ');
        FCC_Global.assert.strictEqual(document.getElementById('number').hasAttribute('placeholder'), true, 'The number input field should have a placeholder attribute ');
        FCC_Global.assert.isAbove(document.getElementById('number').placeholder.length, 0, 'The number input field\'s placeholder attribute should have a value of some text ');
      });

      it('12. I can select an option from a dropdown that has corresponding id="dropdown".', function() {
        var dropdown = document.getElementById('dropdown');
        var dropdownTag = dropdown.tagName;
        var inputSibling = null;
        var inputName = null;
        if (dropdownTag === 'DATALIST') {
          inputSibling = dropdown.previousElementSibling;
          inputName = inputSibling.getAttribute('list');
          FCC_Global.assert.strictEqual(inputName, 'dropdown', 'When using the datalist tag, the accompanying input tag must contain a name attribute matching the datalist id.');
        }
        FCC_Global.assert.isNotNull(dropdown, 'There should be a select field with id="dropdown" ');
        FCC_Global.assert.isAtLeast(getNumOptions(dropdown.options), 2, "Select should contain at least 2 selectable options ");
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #dropdown").length, 0, 'The select field with id="dropdown" is not inside the form element ');
      })

      it('13. I can select a field from one or more groups of radio buttons. Each group should be grouped using the name attribute.', function() {
        var radioButtons = document.querySelectorAll('input[type="radio"]');
        FCC_Global.assert.isAtLeast(radioButtons.length, 2, 'There should be at least 2 radio buttons ');
        FCC_Global.assert.isAtLeast(document.querySelectorAll('#survey-form input[type="radio"]').length, 2, 'There should be at least 2 radio buttons inside the #survey-form ');
        FCC_Global.assert.strictEqual(radioButtons.length, getNumValues(radioButtons), "All your radio-buttons must have a value attribute ");

        var groups = {};
        for (var i = 0; i < radioButtons.length; i++) {
          var groupName = radioButtons[i].name;
          FCC_Global.assert.isAbove(groupName.length, 0, "All your radio-buttons need a name attribute ");
          var objRef = groups[groupName];
          groups[groupName] = objRef
            ? objRef + 1
            : 1;
        }
        for (var group in groups) {
          FCC_Global.assert.isAtLeast(groups[group], 2, "Every radio-button group should have at least 2 radio buttons ");
        }
      });

      it('14. I can select several fields from a series of checkboxes.', function() {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        // need to make sure there are more than two checkboxes, as our default code contains a checkbox as well
        // if we are detecting only two, one of them is ours;
        // our checkbox does not have a value-attribute so we must use "-1" in the third test
        FCC_Global.assert.isAtLeast(checkboxes.length, 3, "There should be at least 2 checkboxes ");
        FCC_Global.assert.isAtLeast(document.querySelectorAll('#survey-form input[type="checkbox"]').length, 2, 'The checkboxes are not inside the form element ');
        FCC_Global.assert.strictEqual(checkboxes.length - 1, getNumValues(checkboxes), "All your checkboxes must have a value attribute ");
      });

      it('15. I am presented with a <textarea> at the end for additional comments.', function() {
        var textareas = document.getElementsByTagName('textarea');
        FCC_Global.assert.isAtLeast(textareas.length, 1, "There should be at least 1 <textarea> ");
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form textarea").length, 0, 'The textarea is not inside the form element ');
      });

      it('16. I am presented with a button with id="submit" to submit all my inputs.', function() {
        var button = document.getElementById("submit");
        FCC_Global.assert.isNotNull(button, 'There should be a button with id="submit" ');
        if (button.nodeName === "INPUT") {
          FCC_Global.assert.strictEqual(button.hasAttribute("type"), true, 'If you are using an <input> element for your button you need to define a type attribute ');
        }
        FCC_Global.assert.strictEqual(button.type, "submit", 'Your button\'s type attribute should have a value of "submit" ');
        FCC_Global.assert.isAbove(document.querySelectorAll("#survey-form #submit").length, 0, 'The button with id="submit" is not inside the form element ');
      });
    }); // END #Content
  }); // END Survery Form tests
} // END createSurveyFormTests()
