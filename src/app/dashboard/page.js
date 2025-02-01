'use client';


import { Avatar, } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import {Button} from "@/components/ui/button";
import { Avatar } from '@chakra-ui/react';

export default function Dashboard() {
    return (

        <>
        {/* <Avatar size="2xl" bg="gray.200" /> */}
<Button>
    click me 
</Button>
<Box bg="gray.200" p={4}>This is a box</Box>;
<Avatar size="2xl" bg="gray.200" />
        </>
    )
}