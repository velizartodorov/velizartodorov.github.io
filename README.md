# Velizar's portfolio 👨‍💼

React-based single page web application representing Velizar's portfolio:

<https://velizartodorov.github.io/>

## How to start locally? 🤔

In project directory, run in terminal:

```js
npm start
```

Go to <http://localhost:3000/>.

That's it. Have fun! 😎 🎉

## CI/CD 🚀

### Github Workflows 🏭

The custom `build-deploy.yml` workflow makes sure that:

- when opening a PR the application will be built with clean dependencies
- when pushing to `master`, it will be automatically deployed

Example:

![cicd](assets/cicd.png)

### Dependabot 🤖

`dependabot.yml` will make sure that bumping of library happens on a regular basis by Dpe with automatic opening of a PR.
