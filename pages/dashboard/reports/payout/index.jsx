import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  HStack,
  Button,
  Table,
  Thead,
  Tr, Th, Td,
  Tbody,
  useToast,
  VisuallyHidden
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ExportPDF = () => {

}

const PayoutReport = () => {
  const serviceId = "25"
  const Toast = useToast({
    position: 'top-right'
  })
  useEffect(() => {
    BackendAxios.post(`/api/razorpay/fetch-payout`).then((res)=>{
      console.log(res.data)
    }).catch(err=>{
      Toast({
        status: 'error',
        title: 'Error Occured',
        description: err.message
      })
    })
  }, [])

  const [colDefs, setColDefs] = useState([
    {
      headerName: '#',
      field: 'sno'
    },
    {
      headerName: 'Payout ID',
      field: 'payout_id'
    },
    {
      headerName: 'Bank',
      field: 'bank'
    },
    {
      headerName: 'Amount',
      field: 'amount'
    },
    {
      headerName: 'Status',
      field: 'status'
    },
    {
      headerName: 'Timestamp',
      field: 'datetime'
    },
  ])
  const [rowData, setRowData] = useState([

  ])

  return (
    <>
      <DashboardWrapper titleText={'Payout Reports'}>

        <HStack mt={16} mb={4}>
          <Button colorScheme={'red'}>PDF Export</Button>
          <Button colorScheme={'whatsapp'}>Excel Export</Button>
        </HStack>
        <Box className='ag-theme-alpine' h={'sm'}>
          <AgGridReact
            columnDefs={colDefs}
            rowData={rowData}
          >

          </AgGridReact>
        </Box>

          <Table>
            <Thead>
              <Tr>
                {
                  colDefs.map((item, key)=>{
                    return(
                      <Th>{item.headerName}</Th>
                    )
                  })
                }
              </Tr>
            </Thead>
          </Table>

      </DashboardWrapper>
    </>
  )
}

export default PayoutReport