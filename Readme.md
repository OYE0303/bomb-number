[中文版本](Readme-Chinese/READMECHINESE.md)

# About the project

This is a bomb number web game application. In this game, there are three computer players who are competing against the user. The main goal of this game is to avoid guessing the bomb number, and users can use various tools to help them win. The game is over once users guess the bomb number.

&nbsp;

# The motivation behind the project

When I was learning Javascript, the instructor had us create a simple web game application that involved guessing the correct number. I enjoy this game application, but it quickly becomes tedious because users can use binary search logic to guess the correct number. As a result, I decided to create another similar game project, but this time it's more interesting and complicated. That is why I decided to create this project.

&nbsp;

# Technologies used

- HTML
- CSS
- Javascript
- API - REST COUNTRIES

&nbsp;

# Project overview

Here, I'll walk you through the game step-by-step.

![This is an image](/img/name.png)
&#8594; After entering the game, users can enter any name they want.

&nbsp;

![This is an image](/img/level.png)
&#8594; The main distinction between these levels is the number of counts available to use the tools

&#8594; The higher level users select, the fewer tool counts are available to them

&nbsp;

![This is an image](/img/country.png)
&#8594; It should be noted that users are not required to select their country; instead, they may select the country of their preference

&#8594; If users do not want to manually select a country, they can click the "Randomly Select" button, which will randomly select a country for them

&nbsp;

![This is an image](/img/range.png)
&#8594; The range of bomb number is determined by the number of ranges

&#8594; If the range is 0 ~ 100, the bomb number must be greater than 0 and less than 100

&#8594; If users select a large number of ranges, it is possible that they will need to spend more time in order to win the game

&#8594; It is highly recommended that users read the FAQ before playing the game

&nbsp;

![This is an image](/img/game.png)
&#8594; On the top right corner, there is a countdown, and users must guess a number before the countdown expires

&#8594; If users do not guess the number before the countdown ends, a random number will be chosen for them

&#8594; It displays the current level in the bottom right corner

&#8594; Users can use the various tools by clicking the button on the bottom left corner

&#8594; Users can hover over the flag to see the country's name, and click the info button to see all of the country's information

&nbsp;

![This is a gif](/img/guess.gif)
&#8594; Normally guess a number

&nbsp;

![This is a gif](/img/pass.gif)
&#8594; Use pass tool

&#8594; Move on to the next player without having to guess a number

&nbsp;

![This is a gif](/img/assign.gif)
&#8594; Use assign tool

&#8594; Assign one of the players to stand in for you in guessing the number

&nbsp;

![This is a gif](/img/reverse.gif)
&#8594; Use u-turn tool

&#8594; Pass the current guessing round and return to the previous player

&nbsp;

![This is a gif](/img/can't-use-tool.gif)
&#8594; Tool cannot be used during another player's round

&nbsp;

# Reflection

## What’s the main obstacle when building this project?

When constructing this project, there are two major challenges.

1. Choosing a Class Name

   When the codebase grows in size, it becomes extremely difficult to come up with a good class name. Because all of the HTML code is in one file, I have to spend a lot of time brainstorming great class names.

2. Logic in games

   The most difficult aspect of this project is ensuring that the game logic is correct. For example, if one of the players uses the u-turn tool, the order of guessing numbers should be reversed; if a computer player uses the assign tool, it cannot assign itself; and the order should automatically skip the player who loses the game. I've also tried a variety of scenarios to see if there are any potential bugs or unexpected behaviors. Even though the game's logic looks simple, it is much more difficult to implement in code.

&nbsp;

## What have I learned from this project?

When I was working on this project, I discovered one thing. As a front-end developer, I must anticipate all possible scenarios that may result in unexpected behavior or bugs. For example, I'll ask myself these questions while working on this project.

1. Q: Will users attempt to click the "Randomly Select" button, which will request data from the server several times?

   A: Yes. To avoid repeatedly requesting data from the server, I can use a cache technique to ensure that data is only requested once.

2. Q: Will users attempt to enter the invalid guessing number?

   A: Yes. To avoid this, I must disable or hide the submit button when the guessing number is invalid.

3. Q: Will users attempt to use the tool during another player's round?

   A: Yes. Users must be informed that they are not permitted to use the tool during the round of another player.

To build a great web application, I can't just assume the user will always behave normally; I have to try to anticipate all bugs or unexpected behavior and fix it for the users.

&nbsp;

## What can be improved in this project?

In this project, there are three things that can be added or improved.

1. Functionality in real time

   If real-time functionality is added, this project will resemble a true online game. The concept is great, but I believe it will be much more difficult for me to implement because I am only learning the fundamentals of front-end development.

2. Backend

   This project can include a backend for storing the user's data. However, I would like to focus on the front-end in this project, but I will attempt to include a simple backend in my next project.

3. Structure of the code

   This project's code structure is not very good. Because I didn't know how to manage code when I built this project, I just threw almost all of the JavaScript and CSS code into one file. Although it appears to be acceptable at this point, the code will need to be separated as the code base grows. As a result, in my next project, I'll try not to put all of the code in one file, so that the code structure can be a little bit cleaner.
