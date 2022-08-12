import { createSlice } from '@reduxjs/toolkit'

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        address: '',
        balance: 0,
        funds: [],
        latestFund: '',
        currentFund: {
            title: '',
            description: '',
            goal: 0,
            minContribution: 0,
            raisedAmount: 0,
            admin: '',
            deadline: 0,
            noOfContributors: 0,
            status: '',
            spendingRequests: []
        },
    },
    reducers: {
        /**
         * Connect account 
         * @param {*} state 
         * @param {*} action 
         */
        connectAccount: (state, action) => {
            state.address = action.payload.address
            state.balance = action.payload.balance

            action.payload.funds.forEach((fund) => {
                state.funds.push({ ...fund })
            })

            if(state.funds.length > 0) state.latestFund = { ...state.funds[state.funds.length - 1] }
        },

        /**
         * Switch account 
         * @param {*} state 
         * @param {*} action 
         */
        switchAccount: (state, action) => {
            state.address = action.payload.newAddress,
            state.balance = action.payload.newBalance
        },

        /**
         * Clear account
         * @param {*} state 
         * @param {*} action 
         */
        clearAccount: (state, action) => {
            state.address = ''
            state.balance = 0
            state.funds = []
        },
        
        /**
         * Add new fund
         * @param {*} state 
         * @param {*} action 
         */
        addFund: (state, action) => {
            state.funds.push(action.payload.newFund)
        },

        /**
         * Set current fund
         * @param {*} state
         * @param {*} action
         */
        setCurrentFund: (state, action) => {
            state.currentFund = {
                // ...state.currentFund,
                ...action.payload.currentFund
            }
        },

        /**
         * Contribute
         * @param {*} state
         * @param {*} action
         */
        contributeFund: (state, action) => {
            console.log(action.payload.amount)
            console.log(state.currentFund.raisedAmount)
            state.currentFund.raisedAmount += action.payload.amount
            state.currentFund.noOfContributors += 1
        }
    }
})

export const { connectAccount, switchAccount, clearAccount, addFund, setCurrentFund, contributeFund } = accountSlice.actions

export default accountSlice.reducer