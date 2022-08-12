import { Link } from 'react-router-dom'

import {
    Flex,
    Heading,
    Button,
} from '@chakra-ui/react'

import logo from '../../logo.png'

import { useSelector, useDispatch } from 'react-redux'
import { handleConnectAccount } from '../store/actions/handleAccount'
import { toastSuccess, toastError } from '../utils/toast'
import { formatAddress } from '../utils/utils'


const styles = {
    background: `linear-gradient(90deg, #efd5ff 0%, #515ada 100%)`
}

const Header = ({ header }) => (
    <Heading color="white" size="sm">{header}</Heading>
)

const Navbar = () => {
    const account = useSelector((state) => state.account)
    const dispatch = useDispatch()
    const connectAccount = async () => {
        const result = await dispatch(handleConnectAccount())
        if (result.passed) {
            toastSuccess(result.msg)
        } else toastError(result.msg)
    }

    return (
        <Flex
            flexDirection="row"
            h="auto"
            px={{ base: 3, sm: 5, md: 20 }}
            py={{ base: 0, sm: 3, md: 4 }}
            justify="space-between"
            align="center"
            bg={styles.background}
        >
            <Link to="/">
                <img src={logo} width="200px" height="200px" />
            </Link>
            <Flex
                flexDirection="row"
                h="auto"
                gap={{ base: 2, sm: 3, md: 10 }}
                justify="flex-start"
                align="center"
            >
                <Link to="/about">
                    <Header header="About Us" />
                </Link>
                <Link to="/funds/topfunds">
                    <Header header="Top Funds" />
                </Link>
                <Link to="/market">
                    <Header header="Market" />
                </Link>
                {account.address &&
                    <Link to="/dashboard">
                        <Header header="Dashboard" />
                    </Link>
                }
                {!account.address ?
                    <Button size="sm" onClick={connectAccount}>
                        <Heading size="sm">Connect Wallet</Heading>
                    </Button>
                    :
                    <Button size="sm" colorScheme="whiteAlpha">
                        <Heading size="xs">Logged in as {formatAddress(account.address)}</Heading>
                    </Button>
                }
            </Flex>
        </Flex>
    )
}

export default Navbar