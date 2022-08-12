import {
    Container,
    Flex,
    Button,
    HStack,
    VStack,
    Heading,
    Text,
    Image,
    AspectRatio,

} from '@chakra-ui/react'

import { ethers } from 'ethers'

import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { formatAddress, weiToEth } from '../utils/utils'
import { useGif } from '../hooks'

const FundCard = ({ address }) => {
    const gifUrl = useGif({ address })

    return (
        address &&
        <VStack direction="column" spacing={10}>
            <Image src={gifUrl} boxSize={300} />
            <Link to={`/funds/${address}`}>
                <Heading size="sm">{formatAddress(address)}</Heading>
            </Link>
        </VStack>
    )
}

const Dashboard = () => {
    let account = useSelector((state) => state.account)

    return (
        !account.address ? (
            <Container
                maxW="8xl"
                p={{ base: 5, sm: 10, md: 20, lg: 30 }}
                m={{ base: 3, sm: 5, md: 10 }}
                centerContent
            >
                <Heading>Nothing to display</Heading>
                <Text>Please connect your Wallet to view or host funds</Text>
            </Container>
        ) :
            <Container
                maxW="8xl"
                p={{ base: 5, sm: 10, md: 20, lg: 30 }}
                mt={{ base: 3, sm: 5, md: 10 }}
                centerContent
            >
                <Flex
                    w="full"
                    direction={{ base: 'column', md: 'row' }}
                    mb={20}
                    justify="space-between"
                >
                    <VStack
                        spacing={10}
                        align="flex-start"
                        h="500px"
                        w="80%"
                    >
                        <VStack
                            pt={10}
                            pr={10}
                            pl={10}
                            pb={10}
                            spacing={10}
                            align="flex-start"
                            bg="gray.100"
                            borderRadius={10}
                        >
                            <HStack spacing={6} alignItems="center" w="full">
                                <AspectRatio ratio={1} w={24}>
                                    <Image src="https://media.giphy.com/media/WBmaTV18idZktQb27A/giphy.gif" alt="this slowpoke moves" width="250" />
                                </AspectRatio>
                                <VStack align="flex-start">
                                    <Heading size="lg">Account Details</Heading>
                                    {account.address &&
                                        <Text size="md">{formatAddress(account.address)}</Text>
                                    }
                                </VStack>
                            </HStack>
                            <VStack spacing={5} align="stretch" w="full">
                                <HStack justifyContent="space-between" spacing="20px">
                                    <Text>Account Balance</Text>
                                    {account.balance &&
                                        <Heading size="xs">{weiToEth(account.balance)} ETH</Heading>
                                    }
                                </HStack>
                                <HStack justifyContent="space-between" spacing="20px">
                                    <Text>Total Funds Hosted</Text>
                                    <Heading size="xs">{account.funds.length}</Heading>
                                </HStack>
                                {/* <HStack justifyContent="space-between" spacing="20px">
                                    <Text>Latest Fund Created</Text>
                                    {account.latestFund &&
                                        <Heading size="xs">{formatAddress(account.latestFund)}</Heading>
                                    }
                                </HStack> */}
                            </VStack>
                        </VStack>
                        <Button size="sm">
                            <Link to="/funds/createfund">
                                Add Fund
                            </Link>
                        </Button>
                    </VStack>
                    <Flex direction="column" align="flex-start" gap={10}>
                        <Heading size="lg">Funds you host</Heading>
                        <Flex direction="row" flexWrap="wrap" rowGap={{ base: 10, md: 20 }} columnGap={{ base: 20, md: 20 }}>
                            {account.funds.map((f, i) => (
                                <VStack key={i} spacing={10}>
                                    <FundCard address={f} />
                                </VStack>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
    )
}

export default Dashboard