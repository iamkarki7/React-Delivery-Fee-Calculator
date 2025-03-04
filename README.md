# Delivery Fee Calculator



## Setup

- Clone this repo
  ```
  git clone 
  ```
- Open the file and start:

  ```
  cd delivery-fee-calculator
  ```

- Install all npm package and run it:
  ```
  npm install
  npm run dev
  ```

## Folder Structure

```
  delivery-fee-calculator
  │   README.md
  │   index.html
  │   ...
  │
  |───.github/workflows
  │           └── nodejs-ci.yml
  │
  |───public
  │   └── calculator-icon.svg
  │
  |───cypress
  │   └── e2e
  │       └── test.cy.ts
  │
  └───src
      |── utils
      │   └── delivery.ts
      │   main.tsx
      │   App.tsx
      │   App.test.tsx
      │   App.css
      │   package.json
      │   ...
      ...

```

- `nodejs-ci.yml` this GitHub Actions workflow installs and caches Node.js dependencies, builds the source code, and runs tests. It includes steps for linting, formatting, and running unit and end-to-end tests. Finally, it deploys the build to GitHub Pages.
- `index.html` is the only `.html` file for the entire React app. React app is displayed in this HTML page, more precisely in the `<div id="root"></div>`. The entire app content is managed dynamically and displayed on this one HTML page.
- `public` folder contains a file that will be read by the browser while the app is being developing, which is `calculator-icon.svg` icon for head.
- `utils` folder has different functions which can be imported to `App.tsx` to caculate delivery fee under different conditions.
- `main.tsx` is the one where the main render call is happening by ReactDOM.render() method. The method ReactDOM.render() injects the React application into the `<div id="root">` so that the app can be rendered in the browser.
- `App.tsx` is a React component called “App”. This component will be the root component to all the other components. As this project is small, this is also a controlled components which control to submit a from.
- `App.test.tsx` is a set of tests runs against the sample App component that I start with. In this case I use [Vitest](https://vitest.dev/) which is a simple testing library built on top of [Vite](https://vitejs.dev/) which takes everything about [Jest](https://jestjs.io/).
- `test.cy.ts` contains end-to-end tests for this web application, ensuring its functionalities work correctly. It tests various scenarios including fee calculation during rush and non-rush hours, as well as validation for incorrect inputs. I use [Cypress](https://www.cypress.io/) as the framework.
- `App.css` stores styling targeting the App component specifically.
- `package.json` lists all the dependencies and scripts needed to run the React app successfully.

## Framework and Tool

- [Vite](https://vitejs.dev/) : This is a small project, I can just use create-react-app, but I choose Vite becasue it runs much faster than create-react-app.

- [Material UI](https://mui.com/material-ui/) : Their components are easy to customize and integrate. Especially its [date and time picker](https://dev.material-ui-pickers.dev/api/DateTimePicker) meets my needs in the project.

- [Formik](https://formik.org/) : It simplifies form handling, validation, and submission processes. This hook provides convenient handleChange and handleSubmit methods, making form data management and validation easier. Additionally, it integrates well with MUI components, making the interface more intuitive and efficient.
#   R e a c t - D e l i v e r y - F e e - C a l c u l a t o r 
 
 # React-Delivery-Fee-Calculator
