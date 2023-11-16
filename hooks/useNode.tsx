"use client"
import { useState } from "react"
import { WorldNode } from "@/types/types"

//Maintain the state of whatever our current node is and provide functions to traverse the nodes

export default function useNode(nodeDict:  {[key: string]: WorldNode}){
    const [currentNode, setCurrentNode] = useState(nodeDict[Object.keys(nodeDict)[0]])
    
    function moveToNode(nodeName: string){
        setCurrentNode(nodeDict[nodeName])
    }

    return {
        currentNode,
        moveToNode
    }
}