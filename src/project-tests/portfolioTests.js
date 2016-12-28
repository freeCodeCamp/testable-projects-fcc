export default function createPortfolioTests() {
  
  describe('#Portfolio tests', function() {
    
    describe('#Content', function() {
      it('1. My portfolio should have a Welcome section with an id of \"welcome-section\".', function() {
        assert.isNotNull(document.getElementById('welcome-section'));
      })
      
      it('2. The welcome section should have an h1 element that contains text.', function() {
        const welcome = document.getElementById('welcome-section')

        assert.isAbove(document.querySelectorAll('#welcome-section h1').length, 0, 'Welcome section should contain an h1 element ');

        assert.isAbove(document.querySelectorAll('#welcome-section h1')[0].innerText.length, 0, 'h1 element in welcome section should contain your name or camper name ');
      })
      
      it('3. My portfolio should have a projects section with an id of \"projects\".', function() {
        assert.isNotNull(document.getElementById('projects'));
      });
      
      it('4. The projects section should contain at least one element with a class of \"project-tile\" to hold a project.', function() {
        assert.isAbove(document.querySelectorAll('#projects .project-tile').length, 0);
      });
      
      it('5. The projects section should contain at least one link to a project.', function() {
        assert.isAbove(document.querySelectorAll('#projects a').length, 0);
      });
      
      it('6. My portfolio should have a navbar with an id of \"navbar\".', function() {
        const navbar = document.getElementById('navbar');

        assert.isNotNull(navbar);
      });
      
      it('7. The navbar should contain at least one link that I can click on to navigate to different sections of the page.', function() {
        assert.isAbove(document.querySelectorAll('#navbar a').length, 0, 'Navbar should contain a link ');

        const links = document.querySelectorAll('#navbar a');

        for(var i = 0; i < links.length; i++) {
          links[i].click();

          if(window.scrollY) {
            // if the window's y position is not 0, clicking a link made it move
            assert.ok(true);
            window.scroll(0, 0);
            return;
          }
        }

        // move window to bottom
        window.scroll(0, document.body.scrollHeight);
        const bottomPositionY = window.scrollY;

        for(var i = 0; i < links.length; i++) {
          links[i].click();

          var distanceFromBottom = bottomPositionY - window.scrollY;

          if(distanceFromBottom) {
            // if distance from bottom is not 0, clicking a link made it move
            assert.ok(true);
            window.scroll(0, 0);
            return;
          }
        }

        // none of the links changed the scroll position
        window.scroll(0, 0);
        assert.isOk(false, 'At least one navbar link should move the page position when clicked ');

      });
      
      it('8. My portfolio should have a link with an id of \"profile-link\", which opens my GitHub or FCC profile in a new tab.', function() {
        const profileLink = document.getElementById('profile-link');

        assert.isNotNull(profileLink);
  
        assert.equal(profileLink.nodeName, 'A');
        
        assert.strictEqual(profileLink.hasAttribute('target'), true, '#profile-link should have a target attribute ');
        
        assert.equal(profileLink.target, '_blank', 'Clicking #profile-link should cause a link to open in a new tab ');

      });
      
    }); // END #Content
    
    describe('#Layout', function() {

      it('1. My portfolio should have at least one media query.', function() {
        // loop through all associated stylesheets and look for media query
        for(var i = 0; i < document.styleSheets.length; i++) {  
          if(document.styleSheets[i].cssRules !== null) {
            for(var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
              if(document.styleSheets[i].cssRules[j].type === 4) {
                assert.isOk(true);
                return;
              }
            }
          }
        }
        // if no media query is detected, test fails
        assert.isOk(false, "No media queries detected ");
      });
      
      it('2. The height of the welcome section should be equal to the height of the viewport.', function() {
        assert.equal(document.getElementById('welcome-section').offsetHeight, document.documentElement.clientHeight, 
        'The height of #welcome-section is not equal to the height of the viewport ');
      });
      
      it('3. The navbar should always be at the top of the viewport.', function() {
        const navbar = document.getElementById('navbar');
        assert.approximately(navbar.getBoundingClientRect().top, 0, 15), 'Navbar\'s parent should be body and it should be at the top of the viewport ';
        window.scroll(0, 500);        
        assert.approximately(navbar.getBoundingClientRect().top, 0, 15, 'Navbar should be at the top of the viewport even after scrolling ');
        window.scroll(0, 0); 
      });
      
    }); // END #Layout

  }); // END #PortfolioTests
} // END createPortfolioTests()