import $ from 'jquery';

export default function createSurveyFormTests() {
    /**
    Returns the number of elements that are selectable
    **/
    function getNumActive(elems) {
        var numActive = 0;
        for (var i = 0; i < elems.length; i++) {
            var el = elems[i];
            if (!el.disabled) {
                numActive++;
            }
        }
        return numActive;
    }

    describe("Survey Form tests", function() {
        describe("#Content", function() {

            it('1. I can see a title with id="title" in H1 sized text.', function() {
                var title = document.getElementById('title');
                FCC_Global.assert.isNotNull(title, "There should be an element with id='title '");
                FCC_Global.assert.strictEqual(title.tagName, "H1", "#title should be in H1 sized text ");
                FCC_Global.assert.isAbove(title.innerText.length, 0, '#title should contain some text ')
            });

            it('2. I can see a short explanation with id="description" in P sized text.', function() {
                var description = document.getElementById('description');
                FCC_Global.assert.isNotNull(description, "There should be an element with id='description' ");
                FCC_Global.assert.strictEqual(description.tagName, "P", "#description should be in P sized text ");
                FCC_Global.assert.isAbove(description.innerText.length, 0, '#description should contain some text ')
            });

            it('3. I am required to enter my name in a field with id="name".', function() {
                var name = document.getElementById("name");
                FCC_Global.assert.isNotNull(name, 'There should be an input text field with id="name" ');
                FCC_Global.assert.strictEqual(name.type, "text", 'input field with id="name" should be a text field ');
                FCC_Global.assert.isOk(name.required, "Name input field should be required ");
            })

            it('4. I am required to enter an email in a field with id="email".', function() {
                var email = document.getElementById("email");
                FCC_Global.assert.isNotNull(email, "There should be an input text field with id='email' ");
                FCC_Global.assert.isOk(email.required, "Email input field should be required ");
            });

            it('5. If I enter an email that is not formatted correctly, I will see an HTML5 validation error.', function() {
                var email = document.getElementById("email");
                FCC_Global.assert.strictEqual(email.type, "email", "Email field should be HTML5 validated ");
            });

            it('6. I can enter a number in a field with id="number".', function() {
                var number = document.getElementById("number");
                FCC_Global.assert.isNotNull(number, "There should be an input text field with id='number' ");
            });

            it('7. If I enter non-numbers in a number field, I will see an HTML5 validation error.', function() {
                var number = document.getElementById("number");
                FCC_Global.assert.strictEqual(number.type, "number", "Number field should be HTML5 validated ");
            });

            it('8. If I enter numbers outside the range of the number field, I will see an HTML5 validation error.', function() {
                var number = document.getElementById("number");
                FCC_Global.assert.isNotNaN(parseInt(number.min), "Minimum number should be defined ")
                FCC_Global.assert.isNotNaN(parseInt(number.max), "Maximum number should be defined ")
            });

            it('9. For the name, email, and number input fields, I can see corresponding labels that describe the purpose of each field with the following ids: id="name-label", id="email-label", and id="number-label".', function() {
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
            });

            it('10. For the name, email, and number input fields, I can see placeholder text that gives me a description or instructions for each field.', function() {
                FCC_Global.assert.strictEqual(document.getElementById('name').hasAttribute('placeholder'), true, 'The name input field should have a placeholder attribute ');
                FCC_Global.assert.isAbove(document.getElementById('name').placeholder.length, 0, 'The name input field\'s placeholder attribute should have a value of some text ');
                FCC_Global.assert.strictEqual(document.getElementById('email').hasAttribute('placeholder'), true, 'The email input field should have a placeholder attribute ');
                FCC_Global.assert.isAbove(document.getElementById('email').placeholder.length, 0, 'The email input field\'s placeholder attribute should have a value of some text ');
                FCC_Global.assert.strictEqual(document.getElementById('number').hasAttribute('placeholder'), true, 'The number input field should have a placeholder attribute ');
                FCC_Global.assert.isAbove(document.getElementById('number').placeholder.length, 0, 'The number input field\'s placeholder attribute should have a value of some text ');
            });

            it('11. I can select an option from a dropdown.', function() {
                var selects = document.getElementsByTagName('select');
                FCC_Global.assert.isAtLeast(selects.length, 1, "There should be at least 1 select field ");
                for (var i = 0; i < selects.length; i++) {
                    var select = selects[i];
                    FCC_Global.assert.isAtLeast(getNumActive(select.options), 1, "Select should contain at least 1 selectable option ");
                }
            })

            it('12. I can select a field from a series of radio buttons.', function() {
                var radioButtons = $(":radio");
                FCC_Global.assert.isAtLeast(radioButtons.length, 1, "There should be at least 1 radio button ");
                FCC_Global.assert.isAtLeast(getNumActive(radioButtons), 1, "Select should contain at least 1 active radio button ");
            });

            it('13. I can select several fields from a series of checkboxes.', function() {
                var checkboxes = $(":checkbox");
                FCC_Global.assert.isAtLeast(checkboxes.length, 1, "There should be at least 1 checkbox ");
                FCC_Global.assert.isAtLeast(getNumActive(checkboxes), 1, "There should be at least 1 active checkbox ");
            });

            it('14. I am presented with a <textarea> at the end for additional comments.', function() {
                var textareas = document.getElementsByTagName('textarea');
                FCC_Global.assert.isAtLeast(textareas.length, 1, "There should be at least 1 <textarea> ");
            });
        }); // END #Content
    }); // END Survery Form tests
} // END createSurveyFormTests()
