const defaultConfig = {
    API_URL: 'http://192.168.1.110:5000' // Your development server IP here
};

export const config = {
    API_URL: process.env.API_URL !== undefined ? process.env.API_URL : defaultConfig.API_URL
};

console.log('Active configuration:', config);
