import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import {
    Box,
    VStack,
    HStack,
    Stack,
    Text,
    Input,
    Button,
    Image,
    FormLabel,
    InputGroup,
    useToast,
    PinInput,
    PinInputField,

} from '@chakra-ui/react'
import Navbar from '../../../hocs/Navbar'
import { FiPhone, FiMail } from 'react-icons/fi'
import { useFormik } from 'formik'
import Link from 'next/link'
import axios from '../../../lib/axios'

const ResetPassword = () => {
    const [isRetailerDisabled, setIsRetailerDisabled] = useState(false)
    const [isDistributorDisabled, setIsDistributorDisabled] = useState(false)
    const [isSuperDistributorDisabled, seSupertIsDistributorDisabled] = useState(true)
    const toast = useToast()


    const formik = useFormik({
        initialValues: {
            email: "",
            mpin: "",
        },
        onSubmit: (values) => {
            // Handling registration API
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, JSON.stringify({
                email: values.email,
                mpin: values.mpin,
            })).then((res) => {
                toast({
                    status: "success",
                    title: "Reset Link Sent",
                    description: "Check your email to reset your password.",
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                })
            }).catch((err) => {
                toast({
                    status: "error",
                    title: "Error Occured",
                    description: "Try again or contact us to reset your password",
                    position: 'top-right'
                })
            })

        }
    })

    return (
        <>
            <Head>
                <title>Pesa24 - Reset Password</title>
            </Head>
            <Navbar />

            <Box>
                <HStack mx={'auto'} my={[0, '12']}
                    w={['full', 'fit-content', 'fit-content']}
                    boxShadow={['none', 'lg']}
                    bg={['white']} border={'1px'}
                    borderColor={'rgb(224,224,224)'}
                    rounded={['unset', 12]}
                    alignItems={'center'} justifyContent={'center'}
                >
                    <form action="#" method="post" onSubmit={formik.handleSubmit}>
                        <VStack p={[4, 8]} w={['full', 'md', 'lg']} h={'auto'}>
                            <Text fontSize={'3xl'}
                                textTransform={'capitalize'}
                                fontWeight={'600'}
                                color={'#444'}
                            >
                                Reset Password
                            </Text>

                            <VStack py={8} spacing={8} alignItems={'flex-start'}>
                                <Box>
                                    <FormLabel pl={2}
                                        htmlFor='user_id'
                                        textAlign={'left'} mb={0}
                                        color={'darkslategray'}
                                    >
                                        Registered Email
                                    </FormLabel>
                                    <InputGroup w={['xs', 'sm']}>
                                        <Input
                                            rounded={'full'}
                                            name={'email'}
                                            placeholder={'Your Email'}
                                            bg={'blue.100'} type={'email'}
                                            required value={formik.values.email}
                                            onChange={formik.handleChange}
                                        />
                                    </InputGroup>
                                </Box>
                                <Box>
                                    <FormLabel pl={2}
                                        textAlign={'left'} mb={0}
                                        color={'darkslategray'}
                                    >
                                        Your MPIN
                                    </FormLabel>
                                    <HStack>
                                        <PinInput otp
                                            onComplete={(values) => formik.setFieldValue("mpin", values)}>
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                        </PinInput>
                                    </HStack>
                                </Box>

                                <Button
                                    w={['xs', 'sm']} type={'submit'}
                                    rounded={'full'}
                                    colorScheme={'blue'}
                                    bg={'#6C00FF'}
                                >
                                    Send Password Reset Link
                                </Button>
                            </VStack>
                        </VStack>
                    </form>

                    <VStack
                        w={['none', 'sm', 'md']} pr={6}
                        display={['none', 'flex', 'flex']}
                        alignItems={'center'} justifyContent={'center'}
                        h={'full'} borderRadius={['unset', '0 12 12 0']}
                    >
                        <Image
                            src={'../password-reset.png'}
                        />
                    </VStack>
                </HStack>
            </Box>
        </>
    )
}

export default ResetPassword