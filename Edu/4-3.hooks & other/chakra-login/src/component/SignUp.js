import React from "react";
import { Box,Button, Checkbox, Flex, Input, InputGroup, InputLeftElement, Link, Spacer, Stack } from "@chakra-ui/react";
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs'

function SignUp() {
  return (
    <Box>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<BsFillPersonFill color="gray.300" />}
        />
        <Input placeholder='手机号或邮箱' />
      </InputGroup>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<BsFillLockFill color="gray.300" />}
        />
        <Input placeholder='密码' />
      </InputGroup>
      <Flex>
        <Checkbox defaultIsChecked>记住我</Checkbox>
        <Spacer />
        <Link>登录遇到问题？</Link>
      </Flex>
      <Button w='100%' bgColor='blue.400' color='white' borderRadius='full'>登录</Button>
    </Box>
  )
}

export default SignUp