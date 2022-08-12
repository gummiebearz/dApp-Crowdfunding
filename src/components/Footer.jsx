import {
    Flex,
    Text,
    Button,
} from '@chakra-ui/react'

const Footer = () => {
    return (
        <Flex
            position="fixed"
            bottom="0"
            w="full"
            direction={{ base: "column", sm: "row" }}
            h="auto"
            py={{ base: 2, sm: 2, md: 2, lg: 2 }}
            justify="center"
            align="center"
            gap={{ base: 2, sm: 3, md: 10 }}
            bg="#D6D6D6"
        >
            <Text fontSize="sm">Gumball09 ❤️️ Made with love</Text>
            <Text fontSize="sm">&copy; All Rights Reserved</Text>
        </Flex>
    )
}

export default Footer