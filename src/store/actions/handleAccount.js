import {
    connectAccount,
    switchAccount,
    clearAccount,
    addFund,
    setCurrentFund,
    contributeFund
} from '../slices/accountSlice'

import { ethers } from 'ethers'
import axios from 'axios'

import { contract } from '../../utils/contract'
import { pinata } from '../../utils/ipfs'

const ethereum = window.ethereum ? window.ethereum : null
const provider = !ethereum ? null : new ethers.providers.Web3Provider(ethereum)
const signer = !ethereum ? null : provider.getSigner()

var contractApp = null
var contractFund = null

export const createContractApp = async () => {
    contractApp = await new ethers.Contract(
        contract.CrowdfundingAppAddress,
        contract.CrowdfundingAppABI,
        signer
    )

    console.log(contractApp)
}

export const handleAccountChange = (accounts) => {
    return async (dispatch) => {
        let result = {
            passed: false,
            msg: ''
        }

        if (accounts.length) {
            result.passed = true
            result.msg = 'Accounts switched'

            let balance = await provider.send('eth_getBalance', [
                accounts[0],
                'latest'
            ])

            balance = Number(
                ethers.utils.formatUnits(balance, 'ether')
            ).toFixed(4)

            dispatch(
                switchAccount({ newAddress: accounts[0], newBalance: balance })
            )
        } else {
            dispatch(clearAccount())
        }

        return result
    }
}

export const handleConnectWallet = () => {
    return async (dispatch) => {
        let result = {
            passed: false,
            msg: ''
        }

        if (!ethereum) result.msg = 'Please install Metamask'
        else {
            createContractApp()

            try {
                const accounts = await provider.send('eth_accounts')
                if (!accounts.length) {
                    result.msg = 'No accounts found'
                } else {
                    result.passed = true
                    result.msg = 'Account connected'

                    let balance = await provider.send('eth_getBalance', [
                        accounts[0],
                        'latest'
                    ])

                    // get all funds and latest fund
                    const funds = await contractApp.getUserFundsList()

                    dispatch(
                        connectAccount({
                            address: accounts[0],
                            balance,
                            funds
                        })
                    )
                }
            } catch (err) {
                result.msg = 'Error connecting account'
                console.log(err)
            }
        }

        return result
    }
}

export const handleConnectAccount = () => {
    return async (dispatch) => {
        let result = {
            passed: false,
            msg: ''
        }

        if (!ethereum) result.msg = 'Please install Metamask'
        else {
            try {
                const accounts = await provider.send('eth_requestAccounts')
                if (!accounts.length) {
                    result.msg = 'You need to create an account'
                } else {
                    result.passed = true
                    result.msg = 'Account connected'

                    let balance = await provider.send('eth_getBalance', [
                        accounts[0],
                        'latest'
                    ])

                    // get all funds and latest fund
                    const funds = await contractApp.getUserFundsList()
                    const latestFund = await contractApp.getUserLatestFund()

                    dispatch(
                        connectAccount({
                            address: accounts[0],
                            balance,
                            funds,
                            latestFund
                        })
                    )
                }
            } catch (err) {
                result.msg = 'Error connecting account'
                console.log(err)
            }
        }

        return result
    }
}

export const handleCreateFund = (payload) => {
    return async (dispatch) => {
        let result = {
            passed: false,
            msg: '',
            data: null
        }

        if (!ethereum) result.msg = 'Please install Metamask'
        else {
            let object = {
                goal: ethers.utils.parseEther(payload.goal),
                deadline: payload.deadline,
                minContribution: ethers.utils.parseEther(
                    payload.minContribution
                ),
                title: payload.title,
                description: payload.description
            }

            try {
                // Pin contract metadata to IPFS
                const response = await axios.post(
                    pinata.PINATA_PIN_URL,
                    object,
                    {
                        headers: {
                            pinata_api_key: pinata.PINATA_API,
                            pinata_secret_api_key: pinata.PINATA_SECRET
                        }
                    }
                )

                console.log(response)

                const txn = await contractApp.createCrowdfunding(
                    object.goal,
                    object.deadline,
                    object.minContribution,
                    response?.data?.IpfsHash,
                    {
                        nonce: 4
                    }
                )

                await txn.wait()
                result.passed = true
                result.msg = 'Fund created successfully'
                result.data = {
                    txnHash: txn?.hash,
                    contractAddress: txn?.to,
                    ipfsHash: response?.data?.IpfsHash
                }
                console.log(txn)

                console.log(response)
                const funds = await contractApp.getUserFundsList()

                dispatch(addFund({ newFund: funds[funds.length - 1] }))
            } catch (err) {
                result.msg = 'Error creating fund'
                console.log(err)
            }
        }

        return result
    }
}

export const getFundsList = async () => {
    return async (dispatch) => {
        try {
            const funds = await contractApp.getUserFundsList()
            console.log(funds)
        } catch (err) {
            console.log(err)
        }
    }
}

export const loadFundContract = async ({ address }) => {
    contractFund = await new ethers.Contract(
        address,
        contract.CrowdfundingABI,
        signer
    )

    console.log(contractFund)
}

export const getFundContractData = () => {
    return async (dispatch) => {
        let result = {
            passed: false,
            msg: '',
            data: null
        }

        try {
            // get metadata from ipfs
            const ipfsHash = await contractFund.getIpfsHash()
            const { data } = await axios.get(pinata.PINATA_GET_URL + ipfsHash)
            const metadata = {
                ...data,
                goal: Number(
                    ethers.utils.formatUnits(data.goal.hex, 'ether')
                ),
                minContribution: Number(
                    ethers.utils.formatUnits(data.minContribution.hex, 'ether')
                )
            }

            // get admin
            const admin = await contractFund.admin()

            // get total number of contributors
            let noOfContributors = await contractFund.noOfContributors()
            noOfContributors = Number(noOfContributors._hex)

            // get total raised amount
            let raisedAmount = await contractFund.getTotalRaisedAmount()
            raisedAmount = Number(
                ethers.utils.formatUnits(raisedAmount._hex, 'ether')
            )

            // get deadline
            let deadline = await contractFund.deadline()
            deadline = Number(deadline._hex)

            const currentFund = {
                ...metadata,
                admin,
                noOfContributors,
                raisedAmount,
                deadline,
                status: 'ongoing'
            }

            console.log(currentFund)
            dispatch(setCurrentFund({ currentFund }))
        } catch (err) {
            result.msg = 'Error fetching fund data'
            console.log(err)
        }

        return result
    }
}

export const contribute = ({ amount }) => {
    return async dispatch => {
        let result = {
            passed: false,
            msg: ''
        }

        try {
            const txn = await contractFund.contribute({
                value: `${ethers.utils.parseEther(amount.toString())._hex}`
            }) 

            await txn.wait()
            console.log(txn)
            result.passed = true
            result.msg = 'Contributed'
            dispatch(contributeFund({ amount }))
        } catch (err) {
            console.log(err) 
            result.msg = 'Error contributing'
        }

        return result
    }
}