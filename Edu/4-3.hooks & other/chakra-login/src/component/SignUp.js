import React from "react";
import { Box, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import { BsFillPersonFill } from 'react-icons/bs'

function SignUp() {
  return <Box>
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<BsFillPersonFill color="gray.300" />}
      />
      <Input placeholder='手机号或邮箱' />
    </InputGroup>
    <Input placeholder='密码' />

  </Box>
}

export default SignUp