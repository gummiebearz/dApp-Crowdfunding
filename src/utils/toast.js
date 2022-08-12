import { toast } from 'react-toastify'

const toastId = 'a-custom-id-to-prevent-duplicates'
const options = {
    autoClose: 2000,
    draggable: false,
    pauseOnHover: false
}

export const toastSuccess = (msg) => {
    toast.success(msg, {
        toastId,
        ...options,
    })
}

export const toastError = (msg) => {
    toast.error(msg, {
        toastId,
        ...options
    })
}
