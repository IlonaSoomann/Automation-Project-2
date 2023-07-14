describe('Issue delete', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.get('[data-testid="list-issue"]')
                .first().click();
            cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        });
    });

    it('Should delete issue.', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').contains('Delete issue').click();

        //Assert, that deletion confirmation dialogue is not visible.
        cy.get('[data-testid="modal:confirm"]').should('not.exist');

        //Assert, that issue is deleted and not displayed on the Jira board anymore.
        cy.get('[data-testid="list-issue"]').first().should('not.exist');
    });

    it('Should start the deleting issue process, but cancelling this action', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').contains('Cancel').click();

        //Assert, that deletion confirmation dialogue is not visible.
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        //Assert, that issue is deleted and not displayed on the Jira board anymore.
        cy.get('[data-testid="icon:close"]').first().click();
        cy.reload();

        cy.get('[data-testid="list-issue"]').first().should('be.visible');
    });
});