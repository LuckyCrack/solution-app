const { exec } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const mongoose = require("mongoose");


console.log("1 - List the files and directories of the current folder.");
console.log("2 - Parse Json file in current directory and save it to MongoDB database.\n");
console.log("Enter the command to run: ");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", function(line) {
    switch (line) {
        case "1":
            exec("ls -la", (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(stdout);
            });
            break;

        case "2":
            mongoose.connect("mongodb+srv://user1:test123@cluster0.cwfyz.mongodb.net/mydb?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log("Connected to MongoDB");
                parseJsonFile();
            })
            .catch(err => {
                console.log("Failed to connect to MongoDB ", err);
            });
            break;

        default:
            console.log("Invalid command");
            break;
    }
});

function parseJsonFile() 
{
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const json = JSON.parse(data);
        const db = mongoose.connection;
        db.collection("data").insertMany(json, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('File parsed and saved to MongoDB database');
            console.log(result.insertedCount + " Items Inserted");
        });
    });
}