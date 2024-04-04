import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";



connect()

export async function POST(request: NextRequest) {
    //extract data from token
    const userId = await getDataFromToken(request)
    const user = await User.findById({_id: userId}).select("-password -username")
    //check if there is no user

    if(!user) {
        NextResponse.json({
            message: "User not found"
        }, {status: 404})
    }

    return NextResponse.json({
        message: "User found", 
        data: user
    })
}