import {
    Container,
    Flex,
    Heading,
    VStack,
    Divider,
    Center,
    Button,
    Show,
    Text,

    useBreakpointValue
} from '@chakra-ui/react'

import { Link } from 'react-router-dom'


const styles = {
    textColor: `linear-gradient(200deg, #efd5ff 0%, #515ada 100%)`,
    buttonColor: `linear-gradient(90deg, #efd5ff 0%, #515ada 100%);`,
    backgroundColor: `linear-gradient(90deg, rgba(63, 43, 150, 0.2) 0%, rgba(168, 192, 255, 0.4) 100%);`,
}

const Section = ({ text, shade }) => {
    const fontSize = useBreakpointValue({ base: 'md', md: 'lg' })
    const bgColor = `linear-gradient(90deg, rgba(63, 43, 150, ${shade}) 0%, rgba(168, 192, 255, ${shade}) 100%);`

    return (
        <Container
            maxW="container.sm"
            bg={bgColor}
            p={5}
            borderTopEndRadius={30}
            borderBottomLeftRadius={30}
            boxShadow="md"
            fontSize={fontSize}
        >
            {text}
        </Container>
    )
}

const Home = () => {
    return (
        <Container
            maxW='container.xl'
            p={{ base: 5, sm: 10, md: 20, lg: 30 }}
            mt={{ base: 3, sm: 5, md: 20 }}
            centerContent
            mb={14}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                gap={{ base: 5, md: 20 }}
                h={{ base: 'auto' }}
                m={5}
            >
                <VStack
                    w="full"
                    spacing={10}
                    mb={{ base: 5, sm: 10 }}
                >
                    <Heading
                        bgGradient={styles.textColor}
                        bgClip="text"
                        fontSize={{ base: "5xl", md: "6xl" }}
                    >
                        The Best Platform
                    </Heading>
                    <VStack w="full" spacing={5} >
                        <Section
                            text="
                                KyrptoFund is an open-source campaign aiming to raise funds for projects
                                across the globe. Having won the award of Best Fund-Raising Platform in 2021,
                                we are proud to say that we have the best systems to provide you with the best
                                experience in no time."
                            shade="0.2"
                        />
                        <Section
                            text="
                                Built for the future, KryptoFund promises to change how traditional funding works.
                                No one will ever have access to your campaign's sensitive data unless they are the
                                campaign creator. Once the creator is set, it cannot be changed or transferred to 
                                any other address."
                            shade="0.4"
                        />
                        <Section
                            text="
                                Don't worry about losing your donation when a campaign's goal is not reached. You have
                                the right to withdraw your donation back or transfer it directly to that campaign's creator
                                or even another ongoing campaign. Your donation will always be in your hands.
                                "
                            shade="0.6"
                        />
                    </VStack>
                </VStack>
                <Show above="md">
                    <Center h="600">
                        <Divider orientation="vertical" />
                    </Center>
                </Show>
                <Show below="md">
                    <Divider />
                </Show>
                <Flex
                    direction="column"
                    align="center"
                    gap={{ base: 5, md: 7 }}
                    mt={5}
                >
                    <Heading size="2xl">Want to fund your project?</Heading>
                    <Link to="/funds/createfund">
                        <Button
                            color="black"
                            colorScheme={styles.buttonColor}
                        >
                            Become a host
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Container>
    )
}

export default Home