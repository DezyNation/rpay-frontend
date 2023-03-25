import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Box,
  HStack,
  VStack,
  Image,
  Text,
  Hide,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { BiRupee, BiUser, BiPowerOff, BiTransferAlt } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import { IoMdHelpBuoy } from "react-icons/io";
import BackendAxios from "../lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BsFileEarmarkBarGraph, BsBank, BsPeopleFill } from "react-icons/bs";
import { GiReceiveMoney } from 'react-icons/gi'
import { HiUsers } from 'react-icons/hi'
import BankDetails from "./BankDetails";


export const SidebarOptions =
  [
    {
      type: 'accordion',
      title: 'profile',
      icon: <BiUser />,
      children: [
        {
          title: 'view profile',
          link: '/dashboard/profile?pageId=profile',
          id: "view-profile",
          soon: false,
        },
        // {
        //   title: 'edit profile',
        //   link: '/dashboard/profile/edit?pageId=profile',
        //   id: "edit-profile",
        //   soon: false,
        // },
        {
          title: 'reset MPIN',
          link: '/dashboard/profile/reset-mpin?pageId=profile',
          id: "reset-mpin",
          soon: false,
        },
        {
          title: 'reset password',
          link: '/dashboard/profile/reset-password?pageId=profile',
          id: "reset-password",
          soon: false,
        },
      ]
    },
    {
      type: 'link',
      title: 'dashboard',
      icon: <VscDashboard />,
      link: '/dashboard?pageId=dashboard',
    },
    {
      type: 'accordion',
      title: 'services',
      icon: <BiRupee />,
      children: [
        {
          title: 'payout',
          link: '/dashboard/services/payout?pageId=services',
          id: "payout",
          soon: false,
        },
      ]
    },
    {
      type: 'link',
      title: 'fund request',
      id: 'request',
      icon: <GiReceiveMoney />,
      link: '/dashboard/fund/request?pageId=request',
    },
    {
      type: 'link',
      title: 'fund settlement',
      id: 'settlement',
      icon: <BsBank />,
      link: '/dashboard/fund-request?pageId=request',
    },
    {
      type: 'accordion',
      title: 'reports',
      id: 'reports',
      icon: <BsFileEarmarkBarGraph />,
      children: [
        {
          title: 'payout reports',
          link: '/dashboard/reports/payout?pageId=reports',
          id: "payoutReports",
          soon: false,
        },
      ]
    },
    {
      type: 'link',
      title: 'support tickets',
      id: 'support',
      icon: <IoMdHelpBuoy />,
      link: '/dashboard/support-tickets?pageId=support',
    },
  ]

const Sidebar = ({ isProfileComplete, userName, userImage, availablePages }) => {
  const [activeServices, setActiveServices] = useState([])
  const Router = useRouter()
  const { pageId } = Router.query
  const [userType, setUserType] = useState("")

  useEffect(() => {
    const activePage = typeof window !== 'undefined' ? document.getElementById(pageId) : document.getElementById("dashboard")
    if (activePage) {
      activePage.style.background = "#3C79F5"
      activePage.style.color = "#FFF"
    }

    setUserType(localStorage.getItem("userType"))
  }, [])

  async function signout() {
    await BackendAxios.post("/logout").then(() => {
      Cookies.remove("verified")
    })
    Router.push("/auth/login")
  }


  return (
    <>
      <Hide below={"md"}>
        <VStack
          className={"sidebar"}
          w={"64"}
          boxShadow={"md"}
          h={"100vh"}
          bg={"white"}
          p={4}
          rounded={"12"}
          border={"1px"}
          borderColor={"gray.300"}
          overflowY={"scroll"}
        >
          {/* Sidebar Profile */}

          <Link href={"/dashboard/profile?pageId=profile"}>
            <VStack spacing={2}>
              <Image
                src={userImage}
                w={"24"}
                rounded={"full"}
                mx={"auto"}
                p={1}
                border={"2px"}
                borderColor={"gray.200"}
              />
              <Text fontSize={"xl"}>{userName}</Text>
              <Text
                fontSize={"sm"}
                color={"darkslategray"}
                textTransform={'capitalize'}
              >{userType.replace("_", " ")}</Text>
            </VStack>
          </Link>

          {/* Sidebar Menu Options */}
          <VStack pt={8} w={"full"} spacing={4}>
            {
              SidebarOptions.map((option, key) => {
                if (option.type == 'link') {
                  return (
                    <Link href={option.link} key={key} style={{ width: "100%" }}>
                      <HStack
                        px={3}
                        py={2}
                        rounded={'full'}
                        overflow={'hidden'}
                        _hover={{ bg: 'aqua' }}
                        id={option.id || option.title}
                      >
                        {option.icon}
                        <Text textTransform={'capitalize'}>{option.title}</Text>
                      </HStack>
                    </Link>
                  )
                }

                if (option.type == 'accordion') {
                  return (
                    <Accordion allowToggle w={'full'}>

                      <AccordionItem>
                        <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                          <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                            {option.icon}
                            <Text textTransform={'capitalize'}>{option.title}</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel px={0}>


                          <VStack
                            w={'full'}
                            alignItems={'flex-start'}
                            justifyContent={'flex-start'}
                            spacing={2}
                            overflow={'hidden'}
                            id={'payout'}
                          >

                            {option.children.map((item, key) => {
                              return (
                                <Link key={key} href={item.link} style={{ width: '100%' }}>
                                  <Text
                                    w={'full'} textAlign={'left'}
                                    px={3} py={2} _hover={{ bg: 'aqua' }}
                                    textTransform={'capitalize'}
                                  >{item.title}</Text>
                                </Link>
                              )
                            })}
                          </VStack>

                        </AccordionPanel>

                      </AccordionItem>

                    </Accordion>
                  )

                }
              })
            }

            {
              userType != "retailer" &&

              <Accordion allowToggle w={'full'}>

                <AccordionItem>
                  <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                    <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                      <BsPeopleFill />
                      <Text textTransform={'capitalize'}>Manage Users</Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel px={0}>


                    <VStack
                      w={'full'}
                      alignItems={'flex-start'}
                      justifyContent={'flex-start'}
                      spacing={2}
                      overflow={'hidden'}
                      id={'users'}
                    >
                      <Link href={"/dashboard/users/create-user?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >Create User</Text>
                      </Link>

                      <Link href={"/dashboard/users/users-list?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >View User</Text>
                      </Link>

                      <Link href={"/dashboard/users/users-report?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >Users Report</Text>
                      </Link>

                    </VStack>

                  </AccordionPanel>

                </AccordionItem>

              </Accordion>
            }


            <HStack
              spacing={2}
              w={"full"}
              borderRadius={"full"}
              px={3}
              py={2}
              bg={'red.400'}
              color={"white"}
              onClick={signout}
              cursor={'pointer'}
            >
              <BiPowerOff />
              <Text>Sign Out</Text>
            </HStack>

            <BankDetails />
          </VStack>
        </VStack>
      </Hide>
    </>
  );
};

export default Sidebar;
