# tiller

This is a [Google App Script](https://www.google.com/script/start/) project for manipulating my [Tiller](https://www.tillerhq.com/) Google spreadsheet, mostly generating reports and automating manual imports so far. Code is bundled with [Webpack](https://webpack.js.org/) and pushed to my GAS spreadsheet project with [Clasp](https://developers.google.com/apps-script/guides/clasp).

Cool things I've learned and incorporated:

[JSDoc can be used as a detatchable type system](https://depth-first.com/articles/2021/10/20/types-without-typescript/), and basically give you almost all the benefits of Typescript without Typescript, in plain normal default Javascript!

I love functional programming, and have [occasionally liked to bash on classes](https://medium.com/@leeraulin/es6-class-is-a-lie-understanding-prototypal-inheritance-77cace882c85)/classical OOP... But it definitely has it's place, and this project seems well suited it to. BUT...I read about this awesome thing called [stamps](https://stampit.js.org/)! Doesn't look like there's been any work on them in 3 years, which is disheartening... The downside is that JSDoc hates them... I have been able to torture it/VSCode into giving me correct type hints very imperfectly... Which is a shame, because they are like classes, but much cooler.
