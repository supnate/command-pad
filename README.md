# Command Pad

Command Pad is a handy GUI application for managing your command line programs.
It helps to start and stop a command line program easily and you can also monitor the output.

# Downloads
Version 0.1.0 Released at 2016-10-22:
* MacOS: [command-pad-0.1.0.dmg](https://supnate.github.io/command-pad-dist/downloads/Command Pad-0.1.0.dmg)
* Windows: incoming...

# Motivation
For the modern web development, it usually needs several terminals opened for just running various dev servers, for example below is my terminal typically looks like:

<img src="/images/terminal.png?raw=true" width="600">

Managing them is frustrating. It's not intuitive which service you need is running and which has stopped unexpectly. Useful terminals which need interactions often collapse into the dropdown menu.

So I created this little tool to manage all of my frequently used command line programs. It looks like:

<img src="/images/pic1.png?raw=true" width="472">

It helps to manage command line programs in one central place with intuitive UI.

# Use cases
Besides running dev servers, Command Pad is also useful for:
1. Running building/testing scripts. You can be prompted when the script is finished.
2. Launch command line GUI apps like JMeter.
3. ...

# More screenshots
Intuitive to add a command:

<img src="/images/pic2.png?raw=true" width="472">

Colorful output:

<img src="/images/pic3.png?raw=true" width="472">

Alert you when some command is finished:

<img src="/images/pic4.png?raw=true" width="472">

# Features
1. Monitor the output and keep the color.
2. Prompt you when some script succeeds or fails.
3. Support `sudo` on MacOS.
4. Open URL directly from the UI.
5. ...

# FAQ:
#### Why is this "little tool" so large?
Command Pad is built with Electron. The minimal dmg built is 35MB.
#### How to delete a command?
Click `sort` icon on the header:

<img src="/images/sort-icon.png?raw=true" width="362">

# Development
To doc...

# License
MIT