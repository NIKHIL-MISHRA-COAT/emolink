import { spawn } from "child_process";
import fs from "fs";

export function runImageProcessing(imageData) {
    console.log("Reached the function");

    // Write the image data to a temporary file
    const tempFilePath = 'temp_image.jpg';
    fs.writeFileSync(tempFilePath, imageData);

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['config/image.py', tempFilePath]);

        let predictionResult = '';

        pythonProcess.stdout.on('data', (data) => {
            predictionResult += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python script stderr:', data.toString());
        });

        pythonProcess.on('error', (error) => {
            console.error('Error spawning Python process:', error);
            reject(error);
        });

        pythonProcess.on('exit', (code) => {
            console.log('Python process exited with code', code);
            if (code === 0) {
                resolve(predictionResult.trim());
            } else {
                console.error(`Python process exited with code ${code}`);
                reject(new Error(`Python process exited with code ${code}`));
            }

            // Remove the temporary file
            fs.unlinkSync(tempFilePath);
        });
    });
}
