const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getUserInput = () => {return process.argv.slice(2)}

const writeFile = (local,body) => {
  fs.writeFile(local,body, (err) => {
    if (!err) {
      const stats = fs.statSync(local)
      const size = stats.size;
      console.log(`Downloaded and saved ${size} bytes to ${local}`)
    }
    process.exit()
  });
}

const pageFetcher = (args) => {
  const url = args[0];
  const local = args[1];
  request(url, (error, response, body) => {
    if (!error && response && response.statusCode === 200) {
      if (body) {
        fs.access(local, fs.constants.F_OK, (err) => {
          if (!err) {
            rl.question(`${local} already exists. Would you like to overwrite it?: `, (args) => {
              if (args.toLowerCase() === 'y') {
                writeFile(local,body);
              }
              rl.close()
            });
          } else {
            writeFile(local, body);
          }
        });
      }
    } else if (response && response.statusCode) {
      console.log(`Request failed. Error Code: ${response.statusCode}`);
      process.exit()
    } else if (error) {
      console.log(`Request failed. Error: ${error}`);
      process.exit()
    }
  });
};

pageFetcher(getUserInput())