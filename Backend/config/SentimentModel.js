import { spawn } from "child_process";

export function predictSentiment(text) {
    return new Promise((resolve, reject) => {
        // Spawn a child process to execute the Python script
        const pythonProcess = spawn('python', ['config/Model.py', text]);

        let prediction = null;

        // Capture the output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            prediction = parseInt(data.toString().trim(), 10);
            const sentiment = prediction === 0 ? 'Negative' : 'Positive';
            console.log(prediction + " " + sentiment);
            resolve({ prediction, sentiment });
        });

        // Handle errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            reject(data);
        });
    });
}
