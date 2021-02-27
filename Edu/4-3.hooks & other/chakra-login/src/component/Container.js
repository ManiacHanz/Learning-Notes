import React from 'react'
import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import SignIn from './SignIn'
import SignUp from './SignUp';


function Container() {
  return (
    <Box w='300px' mx='auto'>
      <Tabs align="center" >
        <TabList border='none'>
          <Tab _focus={{ boxShadow: "none" }}>登录</Tab>
          <Tab _focus={{ boxShadow: "none" }}>注册</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SignUp />
          </TabPanel>
          <TabPanel>
            <SignIn />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Container