const GIPHY_API = import.meta.env.VITE_GIPHY

export const giphy = {
    apiKey: GIPHY_API,
    randomUrl: 'https://api.giphy.com/v1/gifs/random',
    defaultGif: 'https://media.giphy.com/media/hT00d2dSQyef4nMTQE/giphy.gif'
}