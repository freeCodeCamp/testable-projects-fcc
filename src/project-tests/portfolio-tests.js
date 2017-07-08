export default function createPortfolioTests() {

  describe('#Portfolio tests', function() {

    describe('#Content', function() {
      it('1. My portfolio should have a Welcome section with an id of \"welcome-section\".', function() {
        FCC_Global.assert.isNotNull(document.getElementById('welcome-section'));
      })

      it('2. The welcome section should have an h1 element that contains text.', function() {
        const welcome = document.getElementById('welcome-section')

        FCC_Global.assert.isAbove(document.querySelectorAll('#welcome-section h1').length, 0, 'Welcome section should contain an h1 element ');

        FCC_Global.assert.isAbove(document.querySelectorAll('#welcome-section h1')[0].innerText.length, 0, 'h1 element in welcome section should contain your name or camper name ');
      })

      it('3. My portfolio should have a projects section with an id of \"projects\".', function() {
        FCC_Global.assert.isNotNull(document.getElementById('projects'));
      });

      it('4. The projects section should contain at least one element with a class of \"project-tile\" to hold a project.', function() {
        FCC_Global.assert.isAbove(document.querySelectorAll('#projects .project-tile').length, 0);
      });

      it('5. The projects section should contain at least one link to a project.', function() {
        FCC_Global.assert.isAbove(document.querySelectorAll('#projects a').length, 0);
      });

      it('6. My portfolio should have a navbar with an id of \"navbar\".', function() {
        const navbar = document.getElementById('navbar');

        FCC_Global.assert.isNotNull(navbar);
      });

      it('7. The navbar should contain at least one link that I can click on to navigate to different sections of the page.', function() {
        FCC_Global.assert.isAbove(document.querySelectorAll('#navbar a').length, 0, 'Navbar should contain a link ');

        const links = document.querySelectorAll('#navbar a');

        for (var i = 0; i < links.length; i++) {
          links[i].click();

          if (window.scrollY) {
            // if the window's y position is not 0, clicking a link made it move
            FCC_Global.assert.ok(true);
            window.scroll(0, 0);
            return;
          }
        }

        // move window to bottom
        window.scroll(0, document.body.scrollHeight);
        const bottomPositionY = window.scrollY;

        for (var i = 0; i < links.length; i++) {
          links[i].click();

          var distanceFromBottom = bottomPositionY - window.scrollY;

          if (distanceFromBottom) {
            // if distance from bottom is not 0, clicking a link made it move
            FCC_Global.assert.ok(true);
            window.scroll(0, 0);
            return;
          }
        }

        // none of the links changed the scroll position
        window.scroll(0, 0);
        FCC_Global.assert.isOk(false, 'At least one navbar link should move the page position when clicked ');

      });

      it('8. My portfolio should have a link with an id of \"profile-link\", which opens my GitHub or FCC profile in a new tab.', function() {
        const profileLink = document.getElementById('profile-link');

        FCC_Global.assert.isNotNull(profileLink);

        FCC_Global.assert.equal(profileLink.nodeName, 'A');

        FCC_Global.assert.strictEqual(profileLink.hasAttribute('target'), true, '#profile-link should have a target attribute ');

        FCC_Global.assert.equal(profileLink.target, '_blank', 'Clicking #profile-link should cause a link to open in a new tab ');

      });

    }); // END #Content

    describe('#Layout', function() {

      it('1. My portfolio should have at least one media query.', function() {
        let queryRules = [];
        // loop through all associated stylesheets and look for media query
        for (var i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].cssRules !== null) {
            for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
              if (document.styleSheets[i].cssRules[j].type === 4) {
                // push query rules to empty array
                queryRules.push(document.styleSheets[i].cssRules[j]);
              }
            }
          }
        }
        // there is one media query in Mocha.css, so must detect more than 1 query
        FCC_Global.assert.isAbove(queryRules.length, 1, 'No media queries detected ');
      });

      it('2. The height of the welcome section should be equal to the height of the viewport.', function() {
        FCC_Global.assert.equal(document.getElementById('welcome-section').offsetHeight, window.innerHeight, 'The height of #welcome-section is not equal to the height of the viewport ');
      });

      it('3. The navbar should always be at the top of the viewport.', function(done) {
        const navbar = document.getElementById('navbar');
        FCC_Global.assert.approximately(navbar.getBoundingClientRect().top, 0, 15, 'Navbar\'s parent should be body and it should be at the top of the viewport ');
        window.scroll(0, 500);

        // This timeout is to allow page layout to happen after the window.scroll. Without it
        // the getBoundingClientRect can sometimes report the wrong value while the page is
        // still laying out, when using CSS position:sticky.
        // This is apparently a bug with Chrome https://bugs.chromium.org/p/chromium/issues/detail?id=672457
        setTimeout(function() {
          FCC_Global.assert.approximately(navbar.getBoundingClientRect().top, 0, 15, 'Navbar should be at the top of the viewport even after scrolling ');
          window.scroll(0, 0);
          done();
        }, 1);

      });

    }); // END #Layout

  }); // END #PortfolioTests
} // END createPortfolioTests()
