import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import {
    Box,
    Text,
    Stack,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    Input,
    Button,
    Select,
    HStack,
    useToast,
    VisuallyHidden
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import BackendAxios, { ClientAxios, FormAxios } from '../../../lib/axios';
import jsPDF from 'jspdf';
import "jspdf-autotable"
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';



const ExportPDF = () => {
    const doc = new jsPDF('landscape')

    doc.autoTable({ html: '#printable-table' })

    doc.output('dataurlnewwindow');
}


const FundRequest = () => {
    const wrapperRef = useRef(null);
    const Toast = useToast({
        position: 'top-right'
    })
    const [clientLoaded, setClientLoaded] = useState(false)
    const [userName, setUserName] = useState("No Name")
    const [bankDetails, setBankDetails] = useState([])


    useEffect(() => {
        // Fetch available Banks
        ClientAxios.post('/api/cms/banks/fetch').then((res) => {
            setBankDetails(res.data)
        })
    }, [])

    const [columns, setColumns] = useState([
        {
            field: 'amount',
            headerName: 'Amount',
        },
        {
            field: 'status',
            headerName: 'Status',
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
        },
        {
            field: 'transaction_id',
            headerName: 'Transaction ID',
        },
        {
            field: 'transaction_type',
            headerName: 'Transaction Type',
        },
        {
            field: 'transaction_date',
            headerName: 'Transaction Date',
        },
        {
            field: 'transaction_receipt',
            headerName: 'Transaction Receipt',
        },
        {
            field: 'remarks',
            headerName: 'Remarks',
        },
        {
            field: 'admin_remarks',
            headerName: 'Admin Remarks',
        },
    ],)

    const [rowData, setRowData] = useState([
        {
            amount: '',
            status: '',
            bank_name: '',
            transaction_id: '',
            transaction_type: '',
            transaction_date: '',
            transaction_receipt: '',
            remarks: '',
            admin_remarks: '',
        }
    ])


    useEffect(() => {
        setUserName(localStorage.getItem("userName"))
        BackendAxios.get(('api/fund/fetch-fund')).then((res) => {
            setRowData(res.data)
            grid.updateConfig({
                data: res.data
            }).forceRender()
        }).catch(err => {
            console.log(err)
        })
    }, [])


    const Formik = useFormik({
        initialValues: {
            amount: "",
            bankName: "",
            requestFrom: "",
            transactionId: "",
            transactionType: "",
            transactionDate: "",
            depositDate: "",
            receipt: null,
            remarks: "",
        },
        onSubmit: (values) => {
            var formData = new FormData(document.getElementById('request-form'))
            FormAxios.post('/api/fund/request-fund', formData).then((res) => {
                Toast({
                    status: 'success',
                    position: 'top-right',
                    description: 'Fund request added!',
                })
            }).catch(err => {
                Toast({
                    status: 'error',
                    title: 'Error Occured',
                    description: err.message
                })
            })
        }
    })


    return (
        <>
            <DashboardWrapper titleText={'Fund Request'}>
                <form
                    method='POST' id={'request-form'}
                >
                    <Box
                        p={6} w={'full'}
                        bg={'white'}
                        rounded={16}
                        boxShadow={'md'}
                    >
                        <Stack
                            direction={['column', 'row']}
                            spacing={6} p={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Request Amount*</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon children={'₹'} />
                                    <Input
                                        type={'number'}
                                        name={'amount'}
                                        onChange={Formik.handleChange}
                                        value={Formik.values.amount}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Bank Name*</FormLabel>
                                <Select
                                    name={'bankName'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.bankName}
                                >
                                    {
                                        bankDetails.map((bank, key) => {
                                            return (
                                                <option key={key} value={`${bank.bank_name}-${bank.account}`}>
                                                    {bank.bank_name} - {bank.account}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>

                            {/* <FormControl w={['full', 'xs']}>
                                <FormLabel>Request From*</FormLabel>
                                <Select
                                    name={'requestFrom'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.requestFrom}
                                >
                                    {
                                        availableParents.map((parent, key) => {
                                            return (
                                                <option key={key} value={parent.myParentId}>
                                                    {parent.myParentRole}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl> */}

                        </Stack>

                        <Stack
                            direction={['column', 'row']}
                            spacing={6} p={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction ID</FormLabel>
                                <Input
                                    name={'transactionId'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Transaction ID'}
                                    value={Formik.values.transactionId}
                                    textTransform={'uppercase'}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction Date</FormLabel>
                                <Input
                                    name={'transactionDate'}
                                    onChange={Formik.handleChange}
                                    type={'date'} value={Formik.values.transactionDate}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction Type*</FormLabel>
                                <Select
                                    name={'transactionType'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.transactionType}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="imps">IMPS</option>
                                    <option value="neft">NEFT</option>
                                    <option value="rtgs">RTGS</option>
                                    <option value="upi">UPI</option>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={['column', 'row']} p={4} spacing={6}>
                            <FormControl w={['full', 'sm']}>
                                <FormLabel>Remarks</FormLabel>
                                <Input
                                    name={'remarks'}
                                    value={Formik.values.remarks}
                                    onChange={Formik.handleChange}
                                />
                            </FormControl>

                            <FormControl w={['full', 'sm']}>
                                <FormLabel>Transaction Receipt</FormLabel>
                                <Input
                                    name={'receipt'}
                                    onChange={(e) => Formik.setFieldValue('receipt', e.currentTarget.files[0])}
                                    type={'file'} accept={'image/jpeg, image/jpg, image/png, pdf'}
                                />
                            </FormControl>
                        </Stack>
                        <HStack spacing={6} justifyContent={'flex-end'} pt={8}>
                            <Button
                                colorScheme={'red'}
                                variant={'outline'}
                                onClick={Formik.handleReset}
                            >Cear Data</Button>
                            <Button colorScheme={'twitter'} onClick={Formik.handleSubmit}>Send Request</Button>
                        </HStack>
                    </Box>
                </form>

                <Box
                    p={6}
                    mt={12}
                    bg={'white'}
                    boxShadow={'md'}
                >

                    <HStack justifyContent={'space-between'}>
                        <Text fontSize={'lg'} pb={6}>Your Past Fund Requests</Text>

                        <Button colorScheme={'red'} onClick={ExportPDF}>Export PDF</Button>
                    </HStack>
                    <Box h={'sm'} className={'ag-theme-alpine'}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columns}
                            defaultColDef={{
                                filter: true,
                                floatingFilter: true,
                                resizable: true
                            }}
                        >

                        </AgGridReact>
                    </Box>
                </Box>

                <VisuallyHidden>
                    <table id='printable-table'>
                        <thead>
                            <tr>
                                <td>#</td>
                                {
                                    columns.map((column, key) => {
                                        return (
                                            <td key={key}>{column.headerName}</td>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rowData.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{key+1}</td>
                                            <td>{data.amount}</td>
                                            <td>{data.status}</td>
                                            <td>{data.bank_name}</td>
                                            <td>{data.transaction_id}</td>
                                            <td>{data.transaction_type}</td>
                                            <td>{data.transaction_date}</td>
                                            <td>{data.transaction_receipt}</td>
                                            <td>{data.remarks}</td>
                                            <td>{data.admin_remarks}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </VisuallyHidden>
            </DashboardWrapper>
        </>
    )
}

export default FundRequest