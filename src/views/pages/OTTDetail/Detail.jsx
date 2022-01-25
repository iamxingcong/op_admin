import React from 'react'
import Table from './tabel/Table'
import TendTabel from './tabel/TendTable'
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function OTTDetail() {

    // useEffect(()=>{
    //     axios.get
    // },[])
    return (
        <div>
            <Table/>
            <TendTabel/>
        </div>
    )
}
