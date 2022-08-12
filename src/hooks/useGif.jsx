import { useEffect, useState } from 'react'
import { giphy } from '../utils/giphy'
import axios from 'axios'

const useFetch = ({ address }) => {
    const [gifUrl, setGifUrl] = useState('')

    useEffect(() => {
        if (address) fetchGif()
    }, [address])


    const fetchGif = async () => {
        try {
            const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${giphy.apiKey}&tag=kawaii`)
            setGifUrl(response.data.data.images.downsized_medium.url)
        } catch (err) {
            setGifUrl(giphy.defaultGif)
        }
    }

    return gifUrl
}

export default useFetch