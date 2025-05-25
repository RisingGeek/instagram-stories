/* globals cy */

describe('Instagram Stories Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display story thumbnails', () => {
    cy.get('[data-testid="story-list"]').should('be.visible');
    cy.get('[data-testid="story-list-item"]').should('have.length.greaterThan', 0);
  });

  it('should open story viewer on click, display content, and allow navigation', () => {
    // Click on the first story thumbnail
    cy.get('[data-testid="story-list-item"]').first()
      .get('[data-testid="story-list-item-thumbnail"]').first()
      .click()

    // Story Viewer should be visible
    cy.get('[data-testid="story-viewer"]').should('be.visible');

    // Check for initial story content (username, image)
    cy.get('[data-testid="story-viewer-username"]').should('be.visible');
    cy.get('[data-testid="story-viewer-image"]');

    // Wait for image to load
    cy.wait(500);

    // Test progress bars
    cy.get('[data-testid="story-viewer-progress-0"]').should('have.css', 'width').and('not.eq', '0px');

    // Navigate to next story item within the same user
    cy.get('[data-testid="story-viewer-nav-next"]').click();
    // progress bar should have 100% width after navigating past it
    cy.get('[data-testid="story-viewer-progress-0"]')
      .invoke('attr', 'style')
      .should('include', 'width', '100%');
    cy.get('[data-testid="story-viewer-progress-1"]').should('have.css', 'width').and('not.eq', '0px');

    // Navigate to previous story item
    cy.get('[data-testid="story-viewer-nav-prev"]').click();
    // progress bar should not be 0 while coming back
    cy.get('[data-testid="story-viewer-progress-0"]').should('have.css', 'width').and('not.eq', '0px');
    cy.get('[data-testid="story-viewer-progress-1"]').should('have.css', 'width').and('eq', '0px');


    // Close viewer
    cy.get('[data-testid="close-story-viewer"]').click();
    cy.get('[data-testid="story-viewer"]').should('not.exist');
  });

  it('should automatically advance stories after 5 seconds', () => {
    cy.get('[data-testid="story-list-item"]').first()
      .get('[data-testid="story-list-item-thumbnail"]').first()
      .click()

    // Wait for auto-advance (duration + a small buffer)
    // stories.json user1, story1 has 5000ms duration
    cy.wait(5500);

    cy.get('[data-testid="story-viewer-progress-0"]')
      .invoke('attr', 'style')
      .should('include', 'width', '100%');
    cy.get('[data-testid="story-viewer-progress-1"]').should('have.css', 'width').and('not.eq', '0px');

    // Close viewer
    cy.get('[data-testid="close-story-viewer"]').click();
    cy.get('[data-testid="story-viewer"]').should('not.exist');
  });

  it('should navigate to next user when current user stories end', () => {
    cy.get('[data-testid="story-list-item"]').eq(4)
      .get('[data-testid="story-list-item-thumbnail"]').eq(4)
      .click()
    cy.get('[data-testid="story-viewer-username"]').should('contain.text', 'Nishant');

    cy.get('[data-testid="story-viewer-image"]').should('have.attr', 'src').should('include', 'https://picsum.photos/seed/story13/1080/1920');

    // Navigate next 
    cy.get('[data-testid="story-viewer-nav-next"]').click();
    // Wait for a moment for transition and image load
    cy.wait(500);
    // Next user story should be visible
    cy.get('[data-testid="story-viewer-username"]').should('contain.text', 'Ayesha');
    cy.get('[data-testid="story-viewer-image"]').should('have.attr', 'src').should('include', 'https://picsum.photos/seed/story14/1080/1920');

    cy.get('[data-testid="close-story-viewer"]').click();
  });

  it('should handle loading state for images', () => {
    // Intercept the image request to delay it
    cy.intercept('GET', 'https://picsum.photos/seed/story1/1080/1920', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          req.continue(); // Continue with the real image request
          resolve();
        }, 1000);
      });
    }).as('loadImage');

    cy.get('[data-testid="story-list-item"]').first()
      .get('[data-testid="story-list-item-thumbnail"]').first()
      .click();
    cy.get('[data-testid="story-viewer"]').should('be.visible');

    // Spinner should be visible initially
    cy.get('[data-testid="story-viewer-loader"]').should('be.visible');

    // Wait for the image to load
    cy.wait('@loadImage');
    cy.get('[data-testid="story-viewer-loader"]').should('not.exist');

    cy.get('[data-testid="close-story-viewer"]').click();
  });
});