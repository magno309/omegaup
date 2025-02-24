// https://on.cypress.io/custom-commands
import 'cypress-wait-until';
import 'cypress-file-upload';
import { buildURLQuery } from '@/js/omegaup/ui';
import {
  CourseOptions,
  LoginOptions,
  ProblemOptions,
  RunOptions,
} from './types';

// Logins the user given a username and password
Cypress.Commands.add('login', ({ username, password }: LoginOptions) => {
  const URL =
    '/api/user/login?' + buildURLQuery({ usernameOrEmail: username, password });
  cy.request(URL).then((response) => {
    expect(response.status).to.equal(200);
    cy.reload();
  });
});

// Registers and logs in a new user given a username and password.
Cypress.Commands.add('register', ({ username, password }: LoginOptions) => {
  const URL =
    '/api/user/create?' +
    buildURLQuery({ username, password, email: username + '@omegaup.com' });
  cy.request(URL).then((response) => {
    expect(response.status).to.equal(200);
    cy.login({ username, password });
  });
});

Cypress.Commands.add(
  'createProblem',
  ({
    problemAlias,
    tag,
    autoCompleteTextTag,
    problemLevelIndex,
  }: ProblemOptions) => {
    cy.visit('/');
    // Select problem nav
    cy.get('[data-nav-problems]').click();
    cy.get('[data-nav-problems-create]').click();
    // Fill basic problem form
    cy.get('[name="title"]').type(problemAlias).blur();

    // Alias should be the same as title.
    cy.get('[name="problem_alias"]').should('have.value', problemAlias);

    cy.get('[name="source"]').type(problemAlias);
    cy.get('[name="problem_contents"]').attachFile('testproblem.zip');
    cy.get('[data-tags-input]').type(autoCompleteTextTag);

    // Tags panel
    cy.waitUntil(() =>
      cy
        .get('[data-tags-input] .vbt-autcomplete-list a.vbst-item:first')
        .should('have.text', tag) // Maybe theres another way to avoid to hardcode this
        .click(),
    );

    cy.get('[name="problem-level"]').select(problemLevelIndex); // How can we assert this with the real text?

    cy.get('button[type="submit"]').click(); // Submit
  },
);

Cypress.Commands.add(
  'createCourse',
  ({
    courseAlias,
    showScoreboard = false,
    startDate = new Date(),
    unlimitedDuration = true,
    endDate = new Date(),
    school = 'omegaup',
    basicInformation = false,
    requestParticipantInformation = 'no',
    problemLevel = 'introductory',
    description = 'This is the description',
    objective = 'This is an objective',
  }: Partial<CourseOptions> & Pick<CourseOptions, 'courseAlias'>) => {
    cy.get('[data-nav-courses]').click();
    cy.get('[data-nav-courses-create]').click();
    cy.get('[data-course-new-name]').type(courseAlias);
    cy.get('[data-course-new-alias]').type(courseAlias);
    cy.get('[name="show-scoreboard"]') // Currently the two radios are named equally, thus we need to use the eq, to get the correct index and click it
      .eq(showScoreboard ? 0 : 1)
      .click();
    cy.get('[name="start-date"]').type(getISODate(startDate));
    cy.get('[name="unlimited-duration"]')
      .eq(unlimitedDuration ? 0 : 1)
      .click();
    // only if unlimited duration is false we should change the end date
    if (!unlimitedDuration) {
      cy.get('[name="end-date"]').type(getISODate(endDate));
    } else {
      // the end date input should be disabled
      cy.get('[name="end-date"]').should('be.disabled');
    }
    cy.get('.tt-input').first().type(school); // If we use the data attribute, the autocomplete makes multiple elements
    cy.get('[name="basic-information"]') // Currently the two radios are named equally, thus we need to use the eq, to get the correct index and click it
      .eq(basicInformation ? 0 : 1)
      .click();
    cy.get('[data-course-participant-information]').select(
      requestParticipantInformation,
    );
    cy.get('[data-course-problem-level]').select(problemLevel);
    cy.get('[data-course-objective]').type(objective);
    cy.get('[data-course-new-description]').type(description);
    cy.get('button[type="submit"]').click();
  },
);

Cypress.Commands.add(
  'createRun',
  ({ problemAlias, fixturePath, language }: RunOptions) => {
    cy.visit(`arena/problem/${encodeURIComponent(problemAlias)}/`);
    cy.get('[data-new-run]').click();
    cy.get('[name="language"]').select(language);
    cy.fixture(fixturePath).then((fileContent) => {
      cy.get('.CodeMirror-line').type(fileContent);
      cy.get('[data-submit-run]').click();
    });
  },
);

Cypress.Commands.add(
  'createContest',
  ({
    contestAlias,
    description = 'Default Description',
    startDate = new Date(),
    endDate = addDaysToTodaysDate({ days: 1 }),
    showScoreboard = true,
    partialPoints = true,
    basicInformation = false,
    requestParticipantInformation = 'no',
  }) => {
    cy.visit('contest/new/');
    cy.get('[name="title"]').type(contestAlias);
    cy.get('[name="alias"]').type(contestAlias);
    cy.get('[name="description"]').type(description);
    cy.get('[data-start-date]').type(getISODateTime(startDate));
    cy.get('[data-end-date]').type(getISODateTime(endDate));
    cy.get('[data-show-scoreboard-at-end]').select(`${showScoreboard}`); // "true" | "false"
    cy.get('[data-partial-points]').select(`${partialPoints}`);
    if (basicInformation) {
      cy.get('[data-basic-information-required]').click();
    }
    cy.get('[data-request-user-information]').select(
      requestParticipantInformation,
    ); // no | optional | required
    cy.get('button[type="submit"]').click();
  },
);

/**
 *
 * @param date Date object to convert
 * @returns ISO date required to type on a date input inside cypress
 */
export const getISODate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

/**
 *
 * @param date Date object to convert
 * @returns ISO datetime required to type on a date input inside cypress
 */
export const getISODateTime = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

/**
 * Return a date relative to today
 * @param days number of days to add to today
 * @returns Relative Date Object
 */
export const addDaysToTodaysDate = ({ days }: { days: number }): Date => {
  if (days == 0) return new Date();

  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};
