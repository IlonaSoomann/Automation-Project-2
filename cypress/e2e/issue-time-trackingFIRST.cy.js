describe('Issue time tracking', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
            cy.visit(url + '/board');
        });
    });

    it('Should create an issue and add estimation to it, edit and remove it', () => {
        const title = 'TEST_FOR_TIMETRACKING'
        const description = 'TEST_DESCRIPTION'
        const comment = 'TEST'
        const OriginEstimatedHours = '10'
        const EditedEstimatedHours = '20';

        cy.get('[data-testid="icon:plus"]').click();
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(description);
            cy.get('input[name="title"]').type(title);
            cy.get('button[type="submit"]').click();
        });
        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        cy.contains('Issue has been successfully created.').should('be.visible');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '5')
                .first()
                .find('p')
                .contains(title);
        });

        //Adding estimation
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('[placeholder="Number"]').click().type(OriginEstimatedHours);
        //Adding comment, so the added Estimated Hours are saved (without that step, hours are not saved sometimes)
        cy.contains('Add a comment...').click();
        cy.get('textarea[placeholder="Add a comment..."]').type(comment);
        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('10h estimated').should('be.visible');

        //Editing estimation
        cy.get('[placeholder="Number"]').click().clear().type(EditedEstimatedHours);
        //Adding comment, so the edited Estimated Hours are saved (without that step, hours are not saved sometimes)
        cy.contains('Add a comment...').click();
        cy.get('textarea[placeholder="Add a comment..."]').type(comment);
        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('20h estimated').should('be.visible');

        //Removing estimation
        cy.get('[placeholder="Number"]').click().clear();
        //Adding comment, so the removed Estimated Hours are saved (without that step, hours are not saved sometimes)
        cy.contains('Add a comment...').click();
        cy.get('textarea[placeholder="Add a comment..."]').type(comment);
        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.get('[placeholder="Number"]').should('be.visible');
    });

    it('Should create an issue and add estimation to it, log time and remove it', () => {
        const title = 'TEST_FOR_TIMETRACKING'
        const description = 'TEST_DESCRIPTION'
        const comment = 'TEST'
        const OriginEstimatedHours = '10'

        cy.get('[data-testid="icon:plus"]').click();
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(description);
            cy.get('input[name="title"]').type(title);
            cy.get('button[type="submit"]').click();
        });
        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        cy.contains('Issue has been successfully created.').should('be.visible');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '5')
                .first()
                .find('p')
                .contains(title);
        });

        //Adding estimation
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('[placeholder="Number"]').click().type(OriginEstimatedHours);

        //Adding comment, so the added Estimated Hours are saved (without that step, hours are not saved sometimes)
        cy.contains('Add a comment...').click();
        cy.get('textarea[placeholder="Add a comment..."]').type(comment);
        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('10h estimated').should('be.visible');

        //Logging spent time to recently created issue
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');
        cy.get('[placeholder="Number"]').eq(1).click().type('2');
        cy.get('[placeholder="Number"]').eq(2).click().type('5');
        cy.contains('button', 'Done').click().should('not.exist');
        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();

        cy.contains('2h logged').should('be.visible');
        cy.contains('No time logged').should('not.exist');
        cy.contains('5h remaining').should('be.visible');

        //Removing logged time
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');
        cy.get('[placeholder="Number"]').eq(1).click().clear();
        cy.get('[placeholder="Number"]').eq(2).click().clear();
        cy.contains('button', 'Done').click().should('not.exist');
        cy.get('[data-testid="icon:close"]').click();
        cy.get('[data-testid="list-issue"]').contains(title).click();

        cy.contains('No time logged').should('be.visible');
        cy.contains('10h estimated').should('be.visible');
    });
});