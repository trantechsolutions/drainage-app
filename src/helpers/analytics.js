import * as tf from '@tensorflow/tfjs';

/**
 * Creates and trains a simple linear regression model with TensorFlow.js.
 * @param {number[]} yData - An array of numbers (e.g., daily totals).
 * @returns {Promise<{slope: number, nextValue: number}>} - The learned trend and the predicted next value.
 */
export const trainPredictionModel = async (yData) => {
    const n = yData.length;
    if (n < 2) {
        return { slope: 0, nextValue: yData[0] || 0 };
    }

    // 1. Define the model: a simple linear model.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // 2. Compile the model with a loss function and an optimizer.
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // 3. Prepare the data into tensors.
    const xData = Array.from({ length: n }, (_, i) => i); // Time steps [0, 1, 2...]
    const xs = tf.tensor2d(xData, [n, 1]);
    const ys = tf.tensor2d(yData, [n, 1]);

    // 4. Train the model asynchronously.
    await model.fit(xs, ys, { epochs: 75 }); // epochs = # of training cycles

    // 5. Predict the next value in the sequence.
    const nextX = tf.tensor2d([n], [1, 1]);
    const prediction = model.predict(nextX);
    
    // 6. Extract the results from the tensors.
    const nextValue = prediction.dataSync()[0];
    const weights = model.getWeights();
    const slope = weights[0].dataSync()[0]; // The learned 'm' in y = mx + b

    // Clean up tensors to free memory
    xs.dispose();
    ys.dispose();
    nextX.dispose();
    prediction.dispose();
    weights.forEach(w => w.dispose());

    return {
        slope: isNaN(slope) ? 0 : slope,
        nextValue: isNaN(nextValue) ? yData[n - 1] : nextValue,
    };
};