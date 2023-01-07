# Cisco New Hire Test

This project uses Angular 15.0.5. I have decided to use it instead of (preferred) React because I have a lot more experience with Angular.

## Build + Run

Use `npm run build-pipeline` to lint, unit test and build the project.

User `npx playwright test` to run e2e tests. You can then see test report using `npx playwright show-report`. You can set `headless: false` in `playwright.config.ts` to see actual tests being performed in browsers.

Run `npm start` to run a dev server. Navigate to `http://localhost:4200/`.

## Libraries used

* UI components: Angular material
* charts: [ngx-charts](https://github.com/swimlane/ngx-charts)
* linter: ESLint + [@angular-eslint](https://github.com/angular-eslint/angular-eslint)
* unit tests: Jest + [@testing-library](https://testing-library.com/docs/) + [marble tests](https://github.com/cartant/rxjs-marbles) for testing observables
* e2e tests: [Playwright](https://playwright.dev/)

## Comments

The `employeeApiService` simulates call to REST API to get employee list and add a new employee. The `EmployeeListDataSource` class holds the logic
to request employee data based on user interactions with the table UI (sorting, pagination) AND return the data to the `mat-table` component.

## TODO

I didn't take care about bundle size optimization. It isn't huge, but maybe it could be better.

Usage of ngx-charts is somewhat problematic. E.g. jest has problems when transforming to JS the two components which contain ngx-charts (there are some statements that jest TS transformer is unable to process). Because of that I didn't add tests for these two components.
