
<img src="/images/logo.png?raw=true" width="128">

# Command Pad

Command Pad is a handy GUI application for running your command line tasks.
It helps to start and stop a command line program easily and you can also monitor the output.

You can learn more about it by the review by @softpedia: http://www.softpedia.com/get/Programming/Other-Programming-Files/Command-Pad.shtml

# Downloads
Version 0.1.1 Released at 2016-10-26:
* MacOS: [Command Pad-0.1.1.dmg](https://github.com/supnate/command-pad/releases/download/v0.1.1/Command.Pad-0.1.1.dmg)
* Windows: [Command.Pad.Setup.0.1.1.zip](https://github.com/supnate/command-pad/releases/download/v0.1.1/Command.Pad.Setup.0.1.1.zip)

# Motivation
For the modern web development, it usually needs several terminals opened for just running various dev servers, for example below is my terminal typically looks like:

<img src="/images/terminal.png?raw=true" width="600">

Managing them is frustrating. It's not intuitive which service you need is running and which has stopped unexpectly. But the useful terminals which need interactions often collapse into the dropdown menu.

So I created this little tool to manage all of my frequently used command line programs. It looks like:

<img src="/images/pic1.png?raw=true" width="360">

It helps to manage command line programs in one central place with intuitive UI.

# Use cases
Besides running dev servers, Command Pad is also useful for:

1. Running building/testing scripts. You can be prompted when the script is finished.
2. Launch command line GUI apps like JMeter.
3. ...

# More screenshots
Intuitive UI to add a command:

<img src="/images/pic2.png?raw=true" width="360">

Colorful output:

<img src="/images/pic3.png?raw=true" width="360">

Alert you when some command is finished:

<img src="/images/pic4.png?raw=true" width="360">

# Features
1. Monitor the output and keep the color.
2. Prompt you when some script succeeds or fails.
3. Support `sudo` on MacOS.
4. Open URL directly from the UI.
5. ...

# FAQ:
### Why is this "little tool" so large?
Command Pad is built with [Electron](http://electron.atom.io/). The minimal dmg size is about 35MB.
### Why can't I interact with the command?
Command Pad is not to replace your terminal. It's just used for running command line services. So you can't type in the output window.
### How to delete a command?
Click `sort` icon on the header:

<img src="/images/sort-icon.png?raw=true" width="362">

# Privacy
Command Pad will not upload any confidential information of you. But to continously improve the user experience it will only send very few usage data like app openning, command count, platform information etc to the analytics server anonymously. You can check the logic from the source code at `src/node/send_stat.js`. If you don't want this, you can build your own version from source code after deleting the stat logic.

# License
MIT
