# Process Scheduler based on HTML5

> A simulator of process scheduling algorithms. Course project for CO003 Operationg Systems - Spring 2017.
Hongyuan Jin (1409853G-I011-0046)
>



## Algorithms implemented

* First-Come First-Serve (FCFS),
* Shortest Job First (SJF), both preemptive and non-preemptive,
* Round-robin (RR),
* Priority Scheduling: both preemptive and non-preemptive,
* Multi-queue Scheduling (to be implemented)



## Getting started

Please ensure that your device has been successfully installed with [Node.js](https://nodejs.org/en/) of the lastest version (v 7.6.0+) for ES2015 functions support and [Mongodb](https://www.mongodb.com/). And then please enter these commands in cmd: 

```
npm run-script run
```

And then you can access the site through http://localhost:3000

If you want to modify some of the views, please install the latest version of Webpack to build public files and bundle the modules and then invoke 

```
webpack —watch
```

## Todo list

- [x] Basic algorithms
- [x] Tasks adding and flow control
- [x] Shared states management
- [x] File drag-drop and upload
- [x] Timing calculations including each wating and turnaround time as well as average turn around time
- [x] CSS layouts and styling
- [x] Basic login and log out database implementation
- [x] Basic login and log out Server implementation
- [ ] User management system 


## More information

[specification link](http://moodle.must.edu.mo/pluginfile.php/76701/mod_resource/content/2/spec.pdf)
