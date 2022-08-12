import { useEffect, useState } from 'react'
import {
    Container,
    Flex,
    Heading,
    VStack,
    HStack,
    Image,
    Text,
    Button,
    FormControl,
    Spinner,

    useBreakpointValue,
} from '@chakra-ui/react'

import * as Yup from 'yup'
import { Formik, Field } from 'formik'

import { Input, Statistic, Progress } from 'antd'

import { useDispatch, useSelector } from 'react-redux'
import { loadFundContract, getFundContractData, contribute } from '../store/actions/handleAccount'

import { formatAddress } from '../utils/utils'
import { toastSuccess, toastError } from '../utils/toast'

import { useGif } from '../hooks'

const styles = {
    boxShadow: 'rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px',
    shadow: '-2px 1px #fff, 1px -1px #000, rgb(66, 66, 66) -20px 15px 0px 0px',
    borderShadow: 'rgb(66, 66, 66) -7px 5px 0px 0px'
}

const ContributeForm = ({ currentFund: f }) => {
    const dispatch = useDispatch()
    const inputW = useBreakpointValue({ base: '100px', sm: '100px', md: '200px' })

    return (
        f &&
        <Formik
            enableReinitialize={true}
            initialValues={{
                contribution: f.minContribution
            }}
            validationSchema={Yup.object().shape({
                contribution: Yup.number().positive().min(f.minContribution)
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true)
                const result = await dispatch(contribute({ amount: Number(values.contribution) }))

                if (result.passed) {
                    toastSuccess(result.msg)

                    setTimeout(() => {
                        resetForm()
                    }, 1000)
                } else toastError(result.msg)

                setSubmitting(false)
            }}
        >
            {({ handleSubmit, errors, touched, values, isSubmitting, handleChange }) => (
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <Input.Group compact>
                            <Field as={Input}
                                id="contribution"
                                name="contribution"
                                type="text"
                                size="large"
                                style={{ width: `calc(100% - ${inputW})` }}
                                defaultValue={values.contribution}
                                onChange={handleChange}
                                addonAfter="ETH"
                                min={f.minContribution}
                                step="0.0001"
                                status={errors.contribution && touched.contribution ? "error" : ""}
                            />
                            <Button type="submit">
                                {!isSubmitting ?
                                    'Contribute'
                                    :
                                    <Spinner
                                        thickness="2px"
                                        speed="0.65s"
                                        size="md"
                                    />
                                }
                            </Button>
                        </Input.Group>
                    </FormControl>
                </form>
            )}
        </Formik>
    )
}

const FundGif = ({ address }) => {
    const gifUrl = useGif({ address })
    const imgSize = useBreakpointValue({ base: 350, sm: 450, md: 600 })

    return (
        <Image src={gifUrl} boxSize={imgSize} boxShadow={styles.shadow} />
    )
}

const FundInfo = ({ currentFund: f }) => {
    const [show, setShow] = useState(false)
    console.log(f)

    return (
        f &&
        <Flex direction="column" gap={10} wrap="wrap">
            <Flex direction="column" gap={10} wrap="wrap">
                <VStack gap={3} align="flex-start">
                    <Heading>{f.title}</Heading>
                    <Text>Hosted by {formatAddress(f.admin)}</Text>
                </VStack>
                <Flex direction={{ base: 'column', md: 'row' }} gap={20} justify="space-between">
                    <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 10, md: 40 }}>
                        <Statistic title="Goal" value={`${f.goal} ETH`} />
                        <Statistic title="No. Contributors" value={f.noOfContributors} />
                    </Flex>
                    <Statistic.Countdown title="Time Remaining" value={f.deadline} format="DD:HH:mm:ss" />
                </Flex>
            </Flex>
            <VStack align="flex-start" w="70%">
                <Statistic title="Total Amount Raised" value={`${f.raisedAmount.toFixed(4)} ETH`} />
                <HStack align="center" justify="center" w="full">
                    <Progress percent={(f.raisedAmount / f.goal) * 100} status="active" showInfo={false} />
                    <Text>{((f.raisedAmount / f.goal) * 100).toFixed(2)}%</Text>
                </HStack>
            </VStack>
            <Statistic title="Description" value={f.description} valueStyle={{ fontSize: '1rem' }} />
            <VStack spacing={4} align="flex-start" w="full">
                <Heading size="lg">Show your support ❤️️</Heading>
                {!show ?
                    <Button boxShadow={styles.borderShadow} borderRadius={0} onClick={() => setShow((prevState) => !prevState)}>Contribute</Button>
                    :
                    <VStack align="flex-start" spacing={3}>
                        <Text>Min Contribution: {f.minContribution} ETH</Text>
                        <ContributeForm currentFund={f} />
                    </VStack>
                }
            </VStack>
        </Flex>
    )
}

const SpendingRequest = () => {
    return <Heading>Hi</Heading>
}

const Fund = ({ address }) => {
    const dispatch = useDispatch()
    const account = useSelector((state) => state.account)

    useEffect(() => {
        loadFundContract({ address })

        // use setTimeout to wait for 0.2s after the contract is loaded so that the data is available before getting the fund data
        setTimeout(() => {
            dispatch(getFundContractData({ address }))
        }, 20);
    }, [])

    console.log(account.currentFund)

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
        ) : (
            <Flex
                direction="column"
                p={{ base: 5, sm: 10, md: 20, lg: 50 }}
                gap={40}
                bg="red.50"
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="flex-start"
                    gap={{ base: 5, md: 40 }}
                    h={{ base: 'auto' }}
                    ml={10}
                    mr={10}
                >
                    <FundGif address={address} />
                    <FundInfo currentFund={account.currentFund} />
                </Flex>
                <Flex
                    ml={10}
                    mr={10}
                >
                    <VStack spacing={5} align="flex-start" w="50%">
                        <Heading size="lg">Spending Requests</Heading>
                        <VStack spacing={1} align="flex-start">
                            <Text fontSize="md">A Spending Request represents a stage in the development cycle of the project</Text>
                            <Text>
                                Spending Request is a request made by the host to withdraw a certain amount of ETH at a certain amount of time.
                                To be more specific, a project has different stages, and each stage needs a sum of ETH to cover for the development
                                as well as maintainence of the end-product.
                            </Text>
                        </VStack>
                    </VStack>
                </Flex>
            </Flex>
        )
    )
}

export default Fund