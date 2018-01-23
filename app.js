/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */
// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);
const { spawn, exec } = require('child_process');
const fs = require('fs');

// Attempt to import `sails`.
var sails;

try {
  sails = require('sails');
} catch (e) {
  console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
  console.error('To do that, run `npm install sails`');
  console.error('');
  console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
  console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
  console.error('but if it doesn\'t, the app will run with the global sails instead!');
  return e;
}

// --•
// Try to get `rc` dependency (for loading `.sailsrc` files).
var rc;
try {
  rc = require('rc');
} catch (e0) {
  try {
    rc = require('sails/node_modules/rc');
  } catch (e1) {
    console.error('Could not find dependency: `rc`.');
    console.error('Your `.sailsrc` file(s) will be ignored.');
    console.error('To resolve this, run:');
    console.error('npm install rc --save');
    rc = function () { return {}; };
  }
}

// Start server
sails.lift(rc('sails'))

function TakeOff(killNode = false) {
  Modulos.update({ online: true }, { online: false }).then(docs => {
    console.log('docs', docs);

    let neverCalleds = Tokens.update({ dispached: false, called: false, canceled: false }, { canceled: true })

    neverCalleds.then((tokens) => {
      console.log('neverCalleds: ', tokens);
      let noComplete = Tokens.update({ dispached: false, canceled: false, called: true }, { canceled: true })
      noComplete.then((nor) => {
        console.log('no completes', nor);
        sails.sockets.blast("serverOff", { message: "Server getting off" });
    
        if(killNode === true) {
          console.log("kill Node")
          exec('killall -9 node', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          })
        }
       
      }).catch((error) => {
        sails.sockets.blast("serverOff", error, { message: "Server getting off" })
      })
    }).catch((error) => {
      sails.sockets.blast("serverOff", error, { message: "Server getting off" })
    })
  }).catch((error) => {
    sails.sockets.blast("serverOff", error, { message: "Server getting off" })
    response = true;
  })
}//end TakeOff
/*
process.on('uncaughtException', err => {
  //console.log('err', err);
  if(err.errno === "EADDRNOTAVAIL") {
    sails.log("EADDRNOTAVAIL");
  }
})
*/

sails.on("lifted", ()=> {
  sails.log("LEVANTA")
  TakeOff();
/*
  let start = spawn("npm", ["run", "start"])

  start.stdout.on('data', (data) => {
    sails.log(`stdout: ${data}`);
  });

  start.stderr.on('data', (data) => {
    sails.log(`stderr: ${data}`);
  });

  start.on('close', (code) => {
    sails.log(`child process exited with code ${code}`);
    TakeOff(true);
  })
*/
})

sails.on("lower", (e) => {
  console.log("ENTRA ", e)
})
