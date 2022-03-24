# About the project

This is a bomb number web application. There are three computer players playing the game with users. The main goal of this game is to avoid guessing the bomb number, and user can have different tools to use to win the game. Once guessing the bomb number, the game is over. Hope you enjoy this project.

# The motivation behind the project

When I was learning Javascript, the instructor led the student to build a simple game web application which is simply guessing the correct number in the course. This game is okay, but it’s getting boring quickly because users can follow the logic of binary search to guess the correct number. Therefore, I decided to build another similar game project, but it’s more interesting, and more complicated. That’s why I chose to build this project.

# Technologies used

- HTML
- CSS
- Javascript
- API - REST COUNTRIES

# Project overview

![This is an image](/img/name.png)
&#8594; After entering the game, you can input whatever name you prefer

&nbsp;

![This is an image](/img/level.png)
&#8594; The main difference between these levels is the available counts to use the tools

&#8594; The high level you choose, the less available tool counts you have

&nbsp;

![This is an image](/img/country.png)
&#8594; Note that you don’t necessarily need to choose your country, you just choose the country you prefer

&#8594; If you don’t want to manually select country, clicking Randomly Select button to randomly select the country for you

&nbsp;

![This is an image](/img/range.png)
&#8594; The number of range determine the range of bomb number

&#8594; If the range is 0 ~ 100, it guarantees that the bomb number is greater than 0 and less than 100

&#8594; Note that if you choose the large number of range, you may spend more time to win the game

&#8594; It’s highly recommend to check the FAQ before playing the game

&nbsp;

![This is an image](/img/game.png)
&#8594; There’s a countdown on top right corner, users have to input a guess number before the countdown finish(become 00:00)

&#8594; If users don’t guess the number before the countdown finish, it will automatically guess a random number for you

&#8594; On the bottom right corner, it shows the current level

&#8594; On the bottom left corner, users can click the button to use the different tools

&#8594; Users can hover over the flag to see the name of the country, and click the info button to see all the information of the country

&nbsp;

# Reflection

## What’s the main obstacle when building this project?

There are two main obstacles when building this project. First one is naming. When the codebase gets larger, trying to come up with a great class name is really hard. I have to spend a great amount of time thinking about the great class name because all the html code is in one file. Second one is game logic. The most hard part of this project is to make sure the game logic doesn’t have any unexpected behavior. For example, the order of guessing number should be reversed if one of the players uses the u-turn tool, when a computer player using the assign tool, it can’t assign itself, and the order should automatically skip the player who loses the game. Moreover, I’ve tried many different scenarios to test if there’s any bugs or unexpected behavior. Although the game logic sounds easy to understand, it’s a lot harder to implement in code.

## What am I learning from this project?

I’ve learned one thing when I was building this project. As a front-end developer, I have to try to think of all the different scenarios which may have unexpected behavior or bugs beforehand. For example, I’ll ask myself when building this project.

Q: Will users try to click the randomly select country button which will request the data from API a couple times?
A: Yes. To prevent repeatedly requesting the data from API, I can use cache technique to make sure requesting data only happens once

Q; Will users try to submit the invalid guessing number?
A: Yes. To prevent that from happening, I have to disable or hide the submit button when the guess number is invalid

Q: Will users try to use the tool when it’s in another player’s round?
A: Yes. Have to tell the users that they can't use the tool during another player’s round.

There are plenty of situations that may cause some bugs, and I have to fix those beforehand. To build a great web application, I can’t just always assume the user won’t do something unexpectedly, I have to try to think of all the bugs or unexpected behavior beforehand, and fix that for the users.

## What can be improved in this project?

There are three things that can be added or improved in this project. First, it can be more like a real online game if adding real time functionality. The idea is great, but I think it’s way much harder for me to implement since I just learn the basic frontend knowledge. Second, this project can add the backend to store the user's data. However, I would like to focus on the frontend in this project, but I will try to add a simple backend in my second project. Third, the code structure in this project is not that good. Because I lacked knowledge about how to manage the code when I built this project, I just put almost all the javascript and css code in one file. Although it seems acceptable at this point, the code has to be seperate when the code base gets larger.Therefore, I’ll try to not put all the code in one file in my next project, so that the code structure can be cleaner a little bit
