import { ethers } from 'ethers'

export const formatAddress = (addr) => {
    if (addr) {
        return "0x00.000"
    }
    return '0x00...000'
}

export const weiToEth = (amt) => {
    console.log(amt)
    let a = ethers.BigNumber.from(amt).toString()
    console.log(a)
    return ethers.utils.formatUnits(a, 'ether')
}
