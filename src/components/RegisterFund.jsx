import { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import {
    Container,
    Flex,
    VStack,
    Heading,
    SimpleGrid,
    GridItem,
    Button,
    Text,
    FormControl,
    FormLabel,
    Spinner,
    Fade,
    HStack,
    AspectRatio,
    Image,

    useBreakpointValue
} from '@chakra-ui/react'

import * as Yup from 'yup'
import { Formik, Field } from 'formik'

import { Input, DatePicker } from 'antd'

import { useDispatch } from 'react-redux'
import { handleCreateFund } from '../store/actions/handleAccount'
import { toastSuccess, toastError } from '../utils/toast'

import { formatAddress } from '../utils/utils'

const styles = {
    buttonColor: `linear-gradient(90deg, #efd5ff 0%, #515ada 100%);`,
}

const RegisterFund = () => {
    const [deadline, setDeadline] = useState(moment(new Date(), "YYYY-MM-DD"))
    const [show, setShow] = useState(false)
    const [data, setData] = useState({
        txnHash: '',
        contractAddress: '',
        ipfsHash: ''
    })

    const dispatch = useDispatch()

    const colSpan = useBreakpointValue({ base: 2, md: 1 })

    return (
        <Container
            maxW="1300px"
            p={{ base: 5, sm: 10, md: 20, lg: 30 }}
            mt={{ base: 3, sm: 5, md: 20 }}
            centerContent
            mb={20}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                gap={{ base: 5, md: 10 }}
                h={{ base: 'auto' }}
                mb={20}
            >
                <VStack
                    w="full"
                    p={10}
                    spacing={10}
                    alignItems="flex-start"
                    mb={2}
                >
                    <VStack spacing={3} alignItems="flex-start">
                        <Heading size="xl">Fund Details</Heading>
                        <Text>If you have already hosted this fund, please check the statistics here</Text>
                    </VStack>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            title: '',
                            description: '',
                            goal: 0.0,
                            minContribution: 0.0
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().trim().required("This field is required"),
                            description: Yup.string().trim().max(300, "Max length exceeded").required("This field is required"),
                            goal: Yup.number().positive().moreThan(0, "Cannot be 0").max(10000, "Max goal exceeded"),
                            minContribution: Yup.number().positive().moreThan(0, "Cannot be 0"),
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setSubmitting(true)
                            let object = {
                                ...values,
                                deadline: Date.parse(new Date(deadline))
                            }

                            const result = await dispatch(handleCreateFund(object))

                            if (result.passed) {
                                toastSuccess(result.msg)
                                console.log(result.data)

                                setTimeout(() => {
                                    resetForm()
                                    setDeadline((prevState) => moment(null))
                                    setShow((prevState) => !prevState)
                                    setData((prevState) => ({ ...prevState, txnHash: result.data.txnHash, contractAddress: result.data.contractAddress, ipfsHash: result.data.ipfsHash }))
                                }, 1000)
                            } else toastError(result.msg)
                            setSubmitting(false)
                        }}
                    >
                        {({ handleSubmit, errors, touched, values, isSubmitting, handleChange }) => (
                            <form onSubmit={handleSubmit}>
                                <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
                                    <GridItem colSpan={colSpan}>
                                        <FormControl>
                                            <FormLabel>Title</FormLabel>
                                            <Field
                                                as={Input}
                                                id="title"
                                                name="title"
                                                size="large"
                                                status={errors.title && touched.title ? "error" : ""}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormLabel>Deadline</FormLabel>
                                        <DatePicker defaultValue={deadline} id="deadline" name="deadline" showTime size="large" onChange={(date, dateString) => setDeadline(Date.parse(new Date(dateString)))} />
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormControl>
                                            <FormLabel>Goal</FormLabel>
                                            <Field
                                                as={Input}
                                                id="goal"
                                                name="goal"
                                                size="large"
                                                addonAfter="ETH"
                                                status={errors.goal && touched.goal ? "error" : ""}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormControl>
                                            <FormLabel>Minimum Contribution</FormLabel>
                                            <Field
                                                as={Input}
                                                id="minContribution"
                                                name="minContribution"
                                                size="large"
                                                addonAfter="ETH"
                                                status={errors.minContribution && touched.minContribution ? "error" : ""}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <FormControl>
                                            <FormLabel>Description</FormLabel>
                                            <Field
                                                as={Input.TextArea}
                                                id="description"
                                                name="description"
                                                showCount
                                                maxLength={300}
                                                autoSize={{
                                                    minRows: 3,
                                                    maxRows: 6,
                                                }}
                                                status={errors.description && touched.description ? "error" : ""}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <Button type="submit" colorScheme={styles.buttonColor} w="full" disabled={isSubmitting} >
                                            {!isSubmitting ?
                                                'Start Fund'
                                                :
                                                <Spinner
                                                    thickness="2px"
                                                    speed="0.65s"
                                                    size="md"
                                                />
                                            }
                                        </Button>
                                    </GridItem>
                                </SimpleGrid>
                            </form>
                        )}
                    </Formik>
                </VStack>
                <Fade in={show}>
                    {show &&
                        <VStack w="full" spacing={10} align="flex-end">
                            <VStack
                                w="full"
                                p={5}
                                spacing={10}
                                alignItems="flex-start"
                                bg="gray.100"
                            >
                                <VStack spacing={8} alignItems="flex-start">
                                    <HStack spacing={6} alignItems="center" w="full">
                                        <AspectRatio ratio={1} w={24}>
                                            <Image src="https://media.giphy.com/media/hT00d2dSQyef4nMTQE/giphy.gif" alt="this slowpoke moves" width="250" />
                                        </AspectRatio>
                                        <VStack align="flex-start">
                                            <Heading size="lg">Transaction Details</Heading>
                                            <Text size="xs">{formatAddress(data.txnHash)}</Text>
                                        </VStack>
                                    </HStack>
                                    <Text color="red.600">Please save the information below as it is only displayed once</Text>
                                    <VStack spacing={5} alignItems="stretch" w="full">
                                        <HStack justifyContent="space-between" spacing="20px">
                                            <Text>IPFS</Text>
                                            <Heading size="xs">{data.ipfsHash}</Heading>
                                        </HStack>
                                        <HStack justifyContent="space-between" spacing="20px">
                                            <Text>To</Text>
                                            <Heading size="xs">{data.contractAddress}</Heading>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </VStack>
                            <Link to={`/funds/${data.ipfsHash}`}>
                                <Button variant="link">View Fund</Button>
                            </Link>
                        </VStack>
                    }
                </Fade>
            </Flex>
        </Container>
    )
}

export default RegisterFund